from fastapi import FastAPI, HTTPException, Request
from typing import Dict, Any
from app.prompt_builder import build_prompt
from app.llm_client import analyze_with_gemini
import json

app = FastAPI(title="Product Buy Decision AI")

@app.post("/analyze")
async def analyze_product(request: Request):
    try:
        # Get raw body and parse as JSON
        body = await request.body()
        raw_json_str = body.decode('utf-8')
        print(f"Received raw JSON: {raw_json_str[:200]}...")  # Log first 200 chars
        
        data = json.loads(raw_json_str)
        print(f"Parsed data keys: {list(data.keys())}")
        
        prompt = build_prompt(data)
        print(f"Built prompt (first 300 chars): {prompt[:300]}...")
        
        result_text = analyze_with_gemini(prompt)
        print(f"Gemini response: {result_text[:200]}...")

        # Gemini returns text → convert to JSON
        return json.loads(result_text)
    
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")
        if 'result_text' in locals():
            print(f"Raw response: {result_text}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse LLM response as JSON: {str(e)}"
        )
    
    except Exception as e:
        print(f"Error in analyze_product: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


