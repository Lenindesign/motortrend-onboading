/**
 * AI Personal Assistant Component
 * A chat widget that helps users decide what car to buy
 * Personalized based on onboarding data (owned/wanted vehicles)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { getVehicles } from '../../api/vehiclesApi';
import { parseVehicleName } from '../../utils/vehicleImages';
import type { OnboardingData } from '../../types/user';
import './AIPersonalAssistant.css';

export interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  vehicleLinks?: string[];
}

export interface AIPersonalAssistantProps {
  className?: string;
}

export const AIPersonalAssistant: React.FC<AIPersonalAssistantProps> = ({ className }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    // Load onboarding data
    const loadOnboardingData = () => {
      try {
        const data = localStorage.getItem('onboardingData');
        if (data) {
          setOnboardingData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    };

    loadOnboardingData();

    // Listen for onboarding data updates
    const handleUpdate = () => loadOnboardingData();
    window.addEventListener('onboardingDataUpdated', handleUpdate);
    return () => window.removeEventListener('onboardingDataUpdated', handleUpdate);
  }, []);

  // Initialize with greeting message when onboarding data is loaded
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = generateGreeting();
      setMessages([greeting]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateGreeting = (): Message => {
    const ownedVehicles = onboardingData?.vehicles?.filter(v => v.ownership === 'own') || [];
    const wantedVehicles = onboardingData?.vehicles?.filter(v => v.ownership === 'want') || [];

    let greeting = "Hi! I'm your MotorTrend AI assistant. ";
    
    if (ownedVehicles.length > 0 && wantedVehicles.length > 0) {
      const ownedNames = ownedVehicles.map(v => v.name).join(', ');
      const wantedNames = wantedVehicles.map(v => v.name).join(', ');
      greeting += `I see you currently own ${ownedNames} and you're interested in ${wantedNames}. `;
      greeting += "What kind of car are you looking for?";
    } else if (ownedVehicles.length > 0) {
      const ownedNames = ownedVehicles.map(v => v.name).join(', ');
      greeting += `I see you currently own ${ownedNames}. `;
      greeting += "What kind of car are you looking for?";
    } else if (wantedVehicles.length > 0) {
      const wantedNames = wantedVehicles.map(v => v.name).join(', ');
      greeting += `I see you're interested in ${wantedNames}. `;
      greeting += "Would you like me to help you find similar options or compare vehicles?";
    } else {
      greeting += "What kind of car are you looking for?";
    }

    return {
      id: `msg-${Date.now()}`,
      type: 'ai',
      content: greeting,
      timestamp: new Date()
    };
  };

  const generateRecommendations = (userMessage: string): Message => {
    const messageLower = userMessage.toLowerCase();
    const ownedVehicles = onboardingData?.vehicles?.filter(v => v.ownership === 'own') || [];
    const wantedVehicles = onboardingData?.vehicles?.filter(v => v.ownership === 'want') || [];
    
    // Get all vehicles from API
    const allVehicles = getVehicles({ useApiOnly: false });
    
    let response = '';
    let vehicleLinks: string[] = [];

    // Check for common queries
    if (messageLower.includes('suv') || messageLower.includes('family') || messageLower.includes('reliable')) {
      const suvs = allVehicles
        .filter(v => v.bodyStyle === 'SUV')
        .sort((a, b) => b.staffRating - a.staffRating)
        .slice(0, 3);
      
      if (suvs.length > 0) {
        response = "Perfect! Based on your needs, I'd recommend the ";
        const names = suvs.map(v => `${v.year} ${v.make} ${v.model}`);
        vehicleLinks = names;
        
        if (names.length === 1) {
          response += names[0];
        } else if (names.length === 2) {
          response += `${names[0]} or ${names[1]}`;
        } else {
          response += `${names[0]}, ${names[1]}, or ${names[2]}`;
        }
        
        response += ". Would you like me to show you detailed comparisons?";
      } else {
        response = "I'd be happy to help you find a reliable family SUV. Let me search for some great options for you.";
      }
    } else if (messageLower.includes('sedan') || messageLower.includes('car')) {
      const sedans = allVehicles
        .filter(v => v.bodyStyle === 'Sedan')
        .sort((a, b) => b.staffRating - a.staffRating)
        .slice(0, 3);
      
      if (sedans.length > 0) {
        response = "Great choice! I'd recommend the ";
        const names = sedans.map(v => `${v.year} ${v.make} ${v.model}`);
        vehicleLinks = names;
        
        if (names.length === 1) {
          response += names[0];
        } else if (names.length === 2) {
          response += `${names[0]} or ${names[1]}`;
        } else {
          response += `${names[0]}, ${names[1]}, or ${names[2]}`;
        }
        
        response += ". These are top-rated sedans with excellent reliability and value.";
      } else {
        response = "I can help you find the perfect sedan. What's your budget range?";
      }
    } else if (messageLower.includes('truck') || messageLower.includes('pickup')) {
      const trucks = allVehicles
        .filter(v => v.bodyStyle === 'Truck')
        .sort((a, b) => b.staffRating - a.staffRating)
        .slice(0, 3);
      
      if (trucks.length > 0) {
        response = "Excellent! For trucks, I'd recommend the ";
        const names = trucks.map(v => `${v.year} ${v.make} ${v.model}`);
        vehicleLinks = names;
        
        if (names.length === 1) {
          response += names[0];
        } else if (names.length === 2) {
          response += `${names[0]} or ${names[1]}`;
        } else {
          response += `${names[0]}, ${names[1]}, or ${names[2]}`;
        }
        
        response += ". These offer great towing capacity and reliability.";
      } else {
        response = "I can help you find the perfect truck. What will you be using it for?";
      }
    } else if (messageLower.includes('budget') || messageLower.includes('price') || messageLower.includes('$')) {
      // Extract price if mentioned
      const priceMatch = userMessage.match(/\$?(\d+)[kK]?/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1]) * (priceMatch[0].includes('k') || priceMatch[0].includes('K') ? 1000 : 1);
        const affordableVehicles = allVehicles
          .filter(v => v.priceMax <= price)
          .sort((a, b) => b.staffRating - a.staffRating)
          .slice(0, 3);
        
        if (affordableVehicles.length > 0) {
          response = `Perfect! For under $${price.toLocaleString()}, I'd recommend the `;
          const names = affordableVehicles.map(v => `${v.year} ${v.make} ${v.model}`);
          vehicleLinks = names;
          
          if (names.length === 1) {
            response += names[0];
          } else if (names.length === 2) {
            response += `${names[0]} or ${names[1]}`;
          } else {
            response += `${names[0]}, ${names[1]}, or ${names[2]}`;
          }
          
          response += ". These offer great value for your budget.";
        } else {
          response = `I can help you find great options under $${price.toLocaleString()}. What type of vehicle are you interested in?`;
        }
      } else {
        response = "I'd be happy to help you find vehicles within your budget. What's your price range?";
      }
    } else if (messageLower.includes('compare') || messageLower.includes('comparison')) {
      if (wantedVehicles.length > 0) {
        const vehicleNames = wantedVehicles.map(v => v.name);
        response = `I can help you compare ${vehicleNames.join(' and ')}. Would you like to see detailed comparisons including specs, ratings, and pricing?`;
        vehicleLinks = vehicleNames;
      } else {
        response = "I'd be happy to help you compare vehicles. Which cars would you like to compare?";
      }
    } else if (messageLower.includes('help') || messageLower.includes('advice')) {
      response = "I'm here to help! I can assist you with:\n\n";
      response += "• Finding vehicles based on your needs\n";
      response += "• Comparing different models\n";
      response += "• Budget recommendations\n";
      response += "• Vehicle recommendations based on what you own\n";
      response += "\nWhat would you like help with?";
    } else {
      // Generic helpful response
      if (ownedVehicles.length > 0) {
        const ownedName = ownedVehicles[0].name;
        response = `Based on your current ${ownedName}, I can help you find similar vehicles or help you upgrade. `;
        response += "What are you looking for in your next car?";
      } else {
        response = "I'm here to help you find the perfect car! You can ask me about:\n\n";
        response += "• Specific vehicle types (SUVs, sedans, trucks)\n";
        response += "• Budget recommendations\n";
        response += "• Vehicle comparisons\n";
        response += "• Features and specifications\n";
        response += "\nWhat would you like to know?";
      }
    }

    return {
      id: `msg-${Date.now()}`,
      type: 'ai',
      content: response,
      timestamp: new Date(),
      vehicleLinks
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateRecommendations(userMessage.content);
      setIsTyping(false);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVehicleLinkClick = (vehicleName: string) => {
    try {
      const { year, make, model } = parseVehicleName(vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } catch (error) {
      console.error('Error parsing vehicle name:', error);
      // Fallback: navigate to vehicles page with search
      navigate(`/vehicles?search=${encodeURIComponent(vehicleName)}`);
    }
  };

  const handleCompareClick = () => {
    navigate('/compare-vehicles');
  };

  const handlePresetClick = (preset: string) => {
    handleSendMessage(preset);
  };

  const presetOptions = [
    { label: 'Shop New', query: 'Show me new cars' },
    { label: 'Shop Used', query: 'Show me used cars' },
    { label: 'Shop Electric', query: 'Show me electric vehicles' },
    { label: 'Shop SUVs', query: 'I need a reliable family SUV' },
    { label: 'Shop Trucks', query: 'Show me trucks' },
    { label: 'Trade In', query: 'Help me with a trade in' }
  ];

  return (
    <div className={`ai-assistant ${className || ''}`}>
      <div className="ai-assistant__header">
        <div className="ai-assistant__header-content">
          <div className="ai-assistant__avatar">
            <Icon name="auto_awesome" size={24} />
          </div>
          <div className="ai-assistant__header-text">
            <h3 className="ai-assistant__title">Ask MotorTrend</h3>
            <p className="ai-assistant__subtitle">Get personalized car buying advice, available 24/7</p>
          </div>
        </div>
      </div>

      <div className="ai-assistant__chat" ref={chatContainerRef}>
        {messages.length === 1 && (
          <div className="ai-assistant__presets">
            {presetOptions.map((preset, index) => (
              <button
                key={index}
                className="ai-assistant__preset-button"
                onClick={() => handlePresetClick(preset.query)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        <div className="ai-assistant__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-assistant__message ai-assistant__message--${message.type}`}
            >
              {message.type === 'ai' && (
                <div className="ai-assistant__message-avatar">
                  <Icon name="auto_awesome" size={20} />
                </div>
              )}
              <div className="ai-assistant__message-content">
                <div className="ai-assistant__message-text">
                  {message.content.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                {message.vehicleLinks && message.vehicleLinks.length > 0 && (
                  <div className="ai-assistant__vehicle-links">
                    {message.vehicleLinks.map((vehicleName, index) => (
                      <button
                        key={index}
                        className="ai-assistant__vehicle-link"
                        onClick={() => handleVehicleLinkClick(vehicleName)}
                      >
                        {vehicleName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-assistant__message ai-assistant__message--ai">
              <div className="ai-assistant__message-avatar">
                <Icon name="auto_awesome" size={20} />
              </div>
              <div className="ai-assistant__message-content">
                <div className="ai-assistant__typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="ai-assistant__input-container">
        <input
          type="text"
          className="ai-assistant__input"
          placeholder="Ask about cars, maintenance, buying advice..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="ai-assistant__send-button"
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim()}
          aria-label="Send message"
        >
          <Icon name="send" size={20} variant="filled" />
        </button>
      </div>

      <div className="ai-assistant__quick-actions">
        <button
          className="ai-assistant__quick-action"
          onClick={handleCompareClick}
        >
          Compare cars
        </button>
        <button
          className="ai-assistant__quick-action"
          onClick={() => navigate('/vehicles')}
        >
          Browse vehicles
        </button>
      </div>
    </div>
  );
};

export default AIPersonalAssistant;

