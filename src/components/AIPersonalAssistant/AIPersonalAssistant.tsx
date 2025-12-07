/**
 * AI Personal Assistant Component
 * Migrated to inline styles for Tailwind compatibility
 * A chat widget that helps users decide what car to buy
 * Personalized based on onboarding data (owned/wanted vehicles)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { getVehicles } from '../../api/vehiclesApi';
import { parseVehicleName } from '../../utils/vehicleImages';
import type { OnboardingData } from '../../types/user';

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
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);
  const [hoveredVehicleLink, setHoveredVehicleLink] = useState<string | null>(null);
  const [hoveredQuickAction, setHoveredQuickAction] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSendHovered, setIsSendHovered] = useState(false);

  // Get onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  // Inject keyframes and scrollbar styles
  useEffect(() => {
    const styleId = 'ai-assistant-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
        .ai-assistant-chat-scroll::-webkit-scrollbar { width: 6px; }
        .ai-assistant-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .ai-assistant-chat-scroll::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 3px; }
        .ai-assistant-chat-scroll::-webkit-scrollbar-thumb:hover { background: #CCCCCC; }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  // Responsive
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      navigate(`/vehicles?search=${encodeURIComponent(vehicleName)}`);
    }
  };

  const handleCompareClick = () => navigate('/compare-vehicles');

  const handlePresetClick = (preset: string) => handleSendMessage(preset);

  const presetOptions = [
    { label: 'Shop New', query: 'Show me new cars' },
    { label: 'Shop Used', query: 'Show me used cars' },
    { label: 'Shop Electric', query: 'Show me electric vehicles' },
    { label: 'Shop SUVs', query: 'I need a reliable family SUV' },
    { label: 'Shop Trucks', query: 'Show me trucks' },
    { label: 'Trade In', query: 'Help me with a trade in' }
  ];

  // Styles
  const containerStyle: React.CSSProperties = {
    background: 'var(--color-white, #FFFFFF)',
    border: '1px solid #E5E5E5',
    borderRadius: 'var(--border-radius-lg, 16px)',
    boxShadow: '0px 4px 8px 0px rgba(20, 20, 22, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: isMobile ? '500px' : '600px',
    maxHeight: isMobile ? '500px' : '600px',
    overflow: 'hidden',
    width: '100%',
    padding: 0,
    position: 'sticky',
    top: '20px',
    alignSelf: 'flex-start'
  };

  const headerStyle: React.CSSProperties = {
    padding: isMobile ? '16px' : '20px',
    borderBottom: '1px solid #E5E5E5',
    background: 'var(--color-white, #FFFFFF)',
    flexShrink: 0
  };

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    background: 'var(--color-primary-1, #E90C17)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-white, #FFFFFF)',
    flexShrink: 0
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 8px 0',
    lineHeight: 1.2
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
    lineHeight: 1.3
  };

  const chatStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: isMobile ? '16px' : '20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
  };

  const presetsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E5E5'
  };

  const getPresetBtnStyle = (index: number): React.CSSProperties => ({
    padding: '8px 12px',
    border: `1px solid ${hoveredPreset === index ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    background: hoveredPreset === index ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)',
    color: hoveredPreset === index ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)',
    fontFamily: "'Geist', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    transform: hoveredPreset === index ? 'translateY(-1px)' : 'none',
    boxShadow: hoveredPreset === index ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
  });

  const messagesStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const getMessageStyle = (type: 'ai' | 'user'): React.CSSProperties => ({
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    animation: 'fadeIn 0.3s ease-in',
    flexDirection: type === 'user' ? 'row-reverse' : 'row'
  });

  const messageAvatarStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    background: 'var(--color-primary-1, #E90C17)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-white, #FFFFFF)',
    flexShrink: 0,
    marginTop: '4px'
  };

  const getMessageContentStyle = (type: 'ai' | 'user'): React.CSSProperties => ({
    maxWidth: isMobile ? '85%' : '80%',
    padding: '12px 16px',
    wordWrap: 'break-word',
    lineHeight: 1.5,
    background: type === 'user' ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-7, #F4F5F6)',
    color: type === 'user' ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-1, #141416)',
    borderRadius: type === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'
  });

  const messageTextStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: '14px',
    whiteSpace: 'pre-wrap'
  };

  const vehicleLinksStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  };

  const getVehicleLinkStyle = (vehicleName: string): React.CSSProperties => ({
    background: hoveredVehicleLink === vehicleName ? 'var(--color-primary-1, #E90C17)' : 'transparent',
    border: '1px solid #E90C17',
    color: hoveredVehicleLink === vehicleName ? 'var(--color-white, #FFFFFF)' : 'var(--color-primary-1, #E90C17)',
    padding: '4px 8px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: "'Geist', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: hoveredVehicleLink === vehicleName ? 'none' : 'underline',
    textUnderlineOffset: '2px'
  });

  const typingIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    padding: '8px 0'
  };

  const typingDotStyle = (delay: string): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    background: 'var(--color-neutrals-4, #6E7481)',
    animation: `typing 1.4s infinite ease-in-out ${delay}`
  });

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: isMobile ? '8px 16px' : '12px 20px',
    borderTop: '1px solid #E5E5E5',
    background: 'var(--color-white, #FFFFFF)',
    flexShrink: 0
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: `1px solid ${isInputFocused ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: '8px 12px',
    fontFamily: "'Geist', sans-serif",
    fontSize: '14px',
    background: 'var(--color-white, #FFFFFF)',
    color: 'var(--color-neutrals-1, #141416)',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const sendBtnStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--border-radius-md, 8px)',
    background: !inputValue.trim() ? 'var(--color-primary-1, #E90C17)' : isSendHovered ? 'var(--color-primary-2, #c70a15)' : 'var(--color-primary-1, #E90C17)',
    color: 'var(--color-white, #FFFFFF)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: !inputValue.trim() ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s ease',
    flexShrink: 0,
    opacity: !inputValue.trim() ? 0.5 : 1
  };

  const quickActionsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '8px',
    padding: isMobile ? '8px 16px' : '12px 20px',
    borderTop: '1px solid #E5E5E5',
    background: 'var(--color-white, #FFFFFF)',
    flexShrink: 0
  };

  const getQuickActionStyle = (index: number): React.CSSProperties => ({
    flex: 1,
    padding: '8px 12px',
    border: `1px solid ${hoveredQuickAction === index ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-sm, 4px)',
    background: hoveredQuickAction === index ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)',
    color: hoveredQuickAction === index ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)',
    fontFamily: "'Geist', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={containerStyle} className={className || ''}>
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={avatarStyle}>
            <Icon name="auto_awesome" size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={titleStyle}>Ask MotorTrend</h3>
            <p style={subtitleStyle}>Get personalized car buying advice, available 24/7</p>
          </div>
        </div>
      </div>

      <div style={chatStyle} ref={chatContainerRef} className="ai-assistant-chat-scroll">
        {messages.length === 1 && (
          <div style={presetsStyle}>
            {presetOptions.map((preset, index) => (
              <button
                key={index}
                style={getPresetBtnStyle(index)}
                onClick={() => handlePresetClick(preset.query)}
                onMouseEnter={() => setHoveredPreset(index)}
                onMouseLeave={() => setHoveredPreset(null)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        <div style={messagesStyle}>
          {messages.map((message) => (
            <div key={message.id} style={getMessageStyle(message.type)}>
              {message.type === 'ai' && (
                <div style={messageAvatarStyle}>
                  <Icon name="auto_awesome" size={20} />
                </div>
              )}
              <div style={getMessageContentStyle(message.type)}>
                <div style={messageTextStyle}>
                  {message.content.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                {message.vehicleLinks && message.vehicleLinks.length > 0 && (
                  <div style={vehicleLinksStyle}>
                    {message.vehicleLinks.map((vehicleName, index) => (
                      <button
                        key={index}
                        style={getVehicleLinkStyle(vehicleName)}
                        onClick={() => handleVehicleLinkClick(vehicleName)}
                        onMouseEnter={() => setHoveredVehicleLink(vehicleName)}
                        onMouseLeave={() => setHoveredVehicleLink(null)}
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
            <div style={getMessageStyle('ai')}>
              <div style={messageAvatarStyle}>
                <Icon name="auto_awesome" size={20} />
              </div>
              <div style={getMessageContentStyle('ai')}>
                <div style={typingIndicatorStyle}>
                  <span style={typingDotStyle('-0.32s')}></span>
                  <span style={typingDotStyle('-0.16s')}></span>
                  <span style={typingDotStyle('0s')}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={inputContainerStyle}>
        <input
          type="text"
          style={inputStyle}
          placeholder="Ask about cars, maintenance, buying advice..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <button
          style={sendBtnStyle}
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim()}
          onMouseEnter={() => setIsSendHovered(true)}
          onMouseLeave={() => setIsSendHovered(false)}
          aria-label="Send message"
        >
          <Icon name="send" size={20} variant="filled" />
        </button>
      </div>

      <div style={quickActionsStyle}>
        <button
          style={getQuickActionStyle(0)}
          onClick={handleCompareClick}
          onMouseEnter={() => setHoveredQuickAction(0)}
          onMouseLeave={() => setHoveredQuickAction(null)}
        >
          Compare cars
        </button>
        <button
          style={getQuickActionStyle(1)}
          onClick={() => navigate('/vehicles')}
          onMouseEnter={() => setHoveredQuickAction(1)}
          onMouseLeave={() => setHoveredQuickAction(null)}
        >
          Browse vehicles
        </button>
      </div>
    </div>
  );
};

export default AIPersonalAssistant;
