import os
import re
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("GEMINI KEY FOUND:", api_key is not None)
    raise RuntimeError("GEMINI_API_KEY not found")

# Configure Gemini
genai.configure(api_key=api_key)

# Create model
model = genai.GenerativeModel("gemini-2.5-flash")


def extract_json_from_response(text: str) -> str:
    """Extract JSON from LLM response, handling markdown code fences and extra text."""
    if not text or not text.strip():
        raise ValueError("Empty response from LLM")
    
    # Try to find JSON within markdown code fences
    json_match = re.search(r'```(?:json)?\s*({[\s\S]*?})\s*```', text)
    if json_match:
        return json_match.group(1)
    
    # Try to find raw JSON object
    json_match = re.search(r'{[\s\S]*}', text)
    if json_match:
        return json_match.group(0)
    
    # If no JSON found, return the original text
    return text.strip()


def analyze_with_gemini(prompt: str) -> str:
    """Call Gemini API and return extracted JSON string."""
    response = None  # Initialize to avoid UnboundLocalError
    try:
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            raise ValueError("No response from Gemini API")
        
        # Extract JSON from response
        json_text = extract_json_from_response(response.text)
        
        # Validate that it's valid JSON
        json.loads(json_text)  # This will raise JSONDecodeError if invalid
        
        return json_text
    
    except Exception as e:
        print(f"Error in analyze_with_gemini: {str(e)}")
        if response is not None and hasattr(response, 'text'):
            print(f"Raw response: {response.text}")
        raise
