import json
import os

class ChatbotEngine:
    def __init__(self):
        self.flow_data = self.load_chatbot_flow()
        self.current_state = "start"
    
    def load_chatbot_flow(self):
        """Load chatbot flow from JSON file"""
        try:
            with open('chatbot_flow.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "start": {
                    "message": "Hello! I'm currently under construction. Please use the Directory and Community tabs for now.",
                    "options": []
                }
            }
    
    def get_response(self, user_input=None, state=None):
        """Get chatbot response based on current state"""
        if state:
            self.current_state = state
        
        if self.current_state in self.flow_data:
            current_node = self.flow_data[self.current_state]
            return {
                "message": current_node.get("message", "I'm not sure how to respond to that."),
                "options": current_node.get("options", []),
                "state": self.current_state
            }
        else:
            return {
                "message": "I'm currently under construction. Please try the Directory or Community features.",
                "options": [],
                "state": "start"
            }
    
    def process_user_input(self, user_input, current_state="start"):
        """Process user input and return appropriate response"""
        self.current_state = current_state
        
        # Simple keyword-based responses for now
        user_input_lower = user_input.lower() if user_input else ""
        
        if "therapist" in user_input_lower or "find" in user_input_lower:
            return {
                "message": "I can help you find therapists! Please use the Directory tab to search for therapists by city, pincode, or disorder type.",
                "options": [],
                "state": "therapist_search"
            }
        elif "community" in user_input_lower or "support" in user_input_lower:
            return {
                "message": "You can connect with other parents in the Community tab. There are separate sections for parents currently dealing with issues and those who have found solutions.",
                "options": [],
                "state": "community_connect"
            }
        else:
            return self.get_response()

# Example usage
if __name__ == '__main__':
    bot = ChatbotEngine()
    print("Chatbot Engine Test:")
    print(bot.get_response())
    print(bot.process_user_input("I need to find a therapist"))

