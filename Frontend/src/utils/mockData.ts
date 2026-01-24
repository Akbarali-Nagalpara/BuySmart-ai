import { ProductAnalysis } from '../types';

export const generateMockAnalysis = (query: string): ProductAnalysis => {
  const products = [
    {
      id: '1',
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      category: 'Headphones',
      imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 399.99,
      scores: {
        overall: 92,
        sentiment: 94,
        featureQuality: 96,
        brandReliability: 95,
        ratingReview: 89,
        consistency: 87,
      },
      verdict: 'BUY' as const,
      confidence: 'High' as const,
      reviewInsights: {
        positive: [
          'Exceptional noise cancellation, best in class',
          'Superior sound quality with rich bass',
          'Comfortable for extended wear',
          'Great battery life (30+ hours)',
          'Intuitive touch controls',
        ],
        negative: [
          'Premium price point',
          'Case is bulky for travel',
          'No aptX codec support',
          'Minor pressure sensation with ANC',
        ],
      },
      aiSummary: 'The Sony WH-1000XM5 represents the pinnacle of noise-canceling headphones. With industry-leading ANC technology, exceptional audio quality, and premium comfort, these headphones are highly recommended for frequent travelers and audiophiles. Despite the high price, the investment is justified by the superior performance across all metrics.',
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      category: 'Smartphone',
      imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 999.99,
      scores: {
        overall: 88,
        sentiment: 86,
        featureQuality: 93,
        brandReliability: 97,
        ratingReview: 85,
        consistency: 81,
      },
      verdict: 'BUY' as const,
      confidence: 'High' as const,
      reviewInsights: {
        positive: [
          'Powerful A17 Pro chip with excellent performance',
          'Stunning titanium design and build quality',
          'Impressive camera system with advanced features',
          'Action button adds useful customization',
          'Great ecosystem integration',
        ],
        negative: [
          'Very expensive, especially higher storage models',
          'Battery life is just average',
          'USB-C transfer speeds limited on base model',
          'Minor heating issues during intensive tasks',
        ],
      },
      aiSummary: 'The iPhone 15 Pro is a premium flagship smartphone that delivers on performance and design. With the powerful A17 Pro chip, titanium construction, and advanced camera capabilities, it offers excellent value for iOS users. However, the high price and average battery life are considerations for budget-conscious buyers.',
    },
    {
      id: '3',
      name: 'MacBook Pro M3',
      brand: 'Apple',
      category: 'Laptop',
      imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      price: 1599.99,
      scores: {
        overall: 95,
        sentiment: 96,
        featureQuality: 98,
        brandReliability: 97,
        ratingReview: 93,
        consistency: 92,
      },
      verdict: 'BUY' as const,
      confidence: 'High' as const,
      reviewInsights: {
        positive: [
          'Incredible performance with M3 chip',
          'Outstanding battery life (18+ hours)',
          'Beautiful Liquid Retina XDR display',
          'Silent operation with no fans',
          'Excellent build quality and design',
        ],
        negative: [
          'High starting price',
          'Limited port selection',
          'RAM and storage not upgradeable',
          'Requires adapters for some peripherals',
        ],
      },
      aiSummary: 'The MacBook Pro M3 is an exceptional laptop that excels in every category. With groundbreaking performance, incredible battery life, and a stunning display, it\'s perfect for professionals and creative users. While expensive, the long-term value and productivity gains make it a worthy investment.',
    },
    {
      id: '4',
      name: 'Generic Budget Earbuds X200',
      brand: 'NoName',
      category: 'Earbuds',
      imageUrl: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 29.99,
      scores: {
        overall: 42,
        sentiment: 38,
        featureQuality: 45,
        brandReliability: 32,
        ratingReview: 51,
        consistency: 44,
      },
      verdict: 'NOT_BUY' as const,
      confidence: 'High' as const,
      reviewInsights: {
        positive: [
          'Very affordable price point',
          'Decent battery life for the price',
          'Comes with multiple ear tip sizes',
        ],
        negative: [
          'Poor sound quality with muddy bass',
          'Uncomfortable fit after 30 minutes',
          'Frequent connection drops and pairing issues',
          'Cheap plastic build feels fragile',
          'Inconsistent product quality (high defect rate)',
          'Almost no customer support',
        ],
      },
      aiSummary: 'These budget earbuds fail to deliver even basic functionality reliably. Users report frequent connection issues, poor sound quality, and uncomfortable fit. The low price is tempting, but the numerous quality issues and lack of support make this a poor investment. Consider spending a bit more for a reputable brand.',
    },
  ];

  const randomProduct = products[Math.floor(Math.random() * products.length)];

  return {
    product: {
      id: randomProduct.id,
      name: query || randomProduct.name,
      brand: randomProduct.brand,
      category: randomProduct.category,
      imageUrl: randomProduct.imageUrl,
      price: randomProduct.price,
    },
    scores: randomProduct.scores,
    verdict: randomProduct.verdict,
    confidence: randomProduct.confidence,
    reviewInsights: randomProduct.reviewInsights,
    aiSummary: randomProduct.aiSummary,
  };
};
