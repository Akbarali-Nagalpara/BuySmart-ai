import { useState } from 'react';
import { Navigation } from '../layout/Navigation';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Book,
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      category: 'Getting Started',
      question: 'How does BuySmart AI work?',
      answer:
        'BuySmart AI uses advanced machine learning algorithms to analyze product reviews, ratings, features, brand reputation, and market trends. It processes thousands of data points in seconds to give you personalized buy/not-buy recommendations.',
    },
    {
      category: 'Getting Started',
      question: 'Is BuySmart AI free to use?',
      answer:
        'Yes! BuySmart AI offers a free tier that includes basic product analysis. Premium features like unlimited analyses, price tracking, and advanced insights are available in our paid plans.',
    },
    {
      category: 'Features',
      question: 'What makes your AI recommendations reliable?',
      answer:
        'Our AI is trained on millions of product reviews and shopping patterns. It uses natural language processing to understand sentiment, detect fake reviews, and identify genuine product insights. We also factor in brand reliability, price history, and expert opinions.',
    },
    {
      category: 'Features',
      question: 'Can I compare multiple products?',
      answer:
        'Absolutely! Our comparison feature lets you analyze up to 4 products side-by-side, comparing scores, features, prices, and AI recommendations to help you make the best choice.',
    },
    {
      category: 'Features',
      question: 'Do you offer price tracking?',
      answer:
        'Yes! Add products to your wishlist and we\'ll track price changes, sending you alerts when items go on sale or reach your target price.',
    },
    {
      category: 'Account',
      question: 'How do I update my profile information?',
      answer:
        'Navigate to Settings from the navigation menu. There you can update your name, email, password, and notification preferences.',
    },
    {
      category: 'Account',
      question: 'Can I export my analysis history?',
      answer:
        'Yes! Premium users can export their entire analysis history as PDF or CSV files from the History page.',
    },
    {
      category: 'Technical',
      question: 'Which e-commerce platforms do you support?',
      answer:
        'We currently support major platforms including Amazon, Flipkart, and others. We\'re constantly adding new retailers to our database.',
    },
    {
      category: 'Technical',
      question: 'How accurate is the fake review detection?',
      answer:
        'Our fake review detection has a 95% accuracy rate. We use multiple signals including review patterns, language analysis, and reviewer behavior to identify suspicious reviews.',
    },
    {
      category: 'Privacy',
      question: 'How is my data protected?',
      answer:
        'We use industry-standard encryption and never share your personal data with third parties. Your shopping preferences and analysis history are kept completely private.',
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />

      <div className="px-8 lg:px-16 py-8">
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-10 h-10 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-5xl font-extralight text-slate-900 dark:text-white mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          {/* Categories */}
          {categories.map((category) => {
            const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category);
            if (categoryFAQs.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Book className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryFAQs.map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isExpanded = expandedIndex === globalIndex;

                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : globalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="font-medium text-slate-900 dark:text-white pr-4">
                            {faq.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-white text-center mb-8 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
            <p className="mb-8 text-slate-300">
              Our support team is here to assist you
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:support@buysmart.ai"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 transition-all hover:scale-[1.02] flex flex-col items-center gap-3 border border-white/10"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <div className="font-semibold">Email Support</div>
                <div className="text-sm text-slate-300">support@buysmart.ai</div>
              </a>
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 transition-all hover:scale-[1.02] flex flex-col items-center gap-3 border border-white/10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div className="font-semibold">Live Chat</div>
                <div className="text-sm text-slate-300">Available 24/7</div>
              </button>
              <a
                href="tel:+1234567890"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 transition-all hover:scale-[1.02] flex flex-col items-center gap-3 border border-white/10"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                <div className="font-semibold">Phone Support</div>
                <div className="text-sm text-slate-300">+1 (234) 567-890</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
