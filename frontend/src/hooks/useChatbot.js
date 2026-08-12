import { useState } from 'react';
import API from '../utils/api';

const SYSTEM_PROMPT = `You are the official assistant for the BJP Local Body Candidate Application portal.

CONTEXT: This is a 12-step candidate registration wizard for BJP members in Tamil Nadu contesting local body elections.
YOUR ROLE:
- Guide candidates through each of the 12 registration steps in clear English.
- Explain required details: 10-digit mobile number, BJP Membership ID, EPIC Voter ID.
- Explain local body types:
  RURAL: Gram Panchayat, Panchayat Union, District Panchayat, Town Panchayat, Village Council, Block Council.
  URBAN: Municipal Corporation, Municipality, Town Panchayat, Special/Selection/First Grade Municipality.
- Assist with troubleshooting EPIC lookups and OTP verification.
- Respond politely and concisely in English. Keep responses under 80 words.
- Greet with "Namaste 🙏" on first message. End helpful answers with "Jai Hind 🇮🇳".`;

export const useChatbot = (currentStep = 1) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste 🙏 Welcome to the BJP Candidate Application portal! How can I assist you with your step-by-step registration today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Proxy or call chat API endpoint
      const res = await API.post('/user-chat/message', {
        message: userText,
        currentStep,
        systemPrompt: SYSTEM_PROMPT,
        history: newMessages.slice(-6)
      });

      const reply = res.data?.reply || res.data?.message || `Namaste 🙏 For Step ${currentStep}, please make sure all required fields are filled out accurately. Jai Hind 🇮🇳`;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      // Graceful fallback response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Namaste 🙏 Step ${currentStep}: Enter your valid details to proceed smoothly. If you encounter any issue, verify your EPIC Voter ID and mobile number. Jai Hind 🇮🇳`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading
  };
};
