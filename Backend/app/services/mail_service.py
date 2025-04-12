import os
from typing import Dict, Any, Optional, List
from datetime import datetime
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

def send_mail(user_email: str, admin_email: str, order_data: Dict[str, Any]) -> bool:
    """
    Send confirmation emails for an order.
    
    Args:
        user_email: Customer's email address
        admin_email: Admin's email address
        order_data: Data from the order creation request with items, delivery_fee, and total_amount
    """
    try:
        # Use API key directly
        BREVO_API_KEY = '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'
        store_name = 'Farmers Mandiiii'
        sender_email = admin_email
        
        # Configure API key authorization
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = BREVO_API_KEY
        
        # Create an instance of the API class
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
        
        # Simple order placed message
        order_message = "Order placed"
            
        # Customer email
        customer_email_params = {
            "to": [{"email": user_email}],
            "subject": f"Your Order - {store_name}",
            "sender": {"name": store_name, "email": sender_email},
            "textContent": f"""
Dear Customer,

{order_message}

Best regards,
The {store_name} Team
"""
        }
        
        # Admin email
        admin_email_params = {
            "to": [{"email": admin_email}],
            "subject": f"New Order - {store_name}",
            "sender": {"name": "Order System", "email": sender_email},
            "textContent": f"""
Hello Admin,

{order_message}

This is an automated notification.
"""
        }
        
        try:
            # Create and send the emails
            customer_email = sib_api_v3_sdk.SendSmtpEmail(**customer_email_params)
            admin_email_obj = sib_api_v3_sdk.SendSmtpEmail(**admin_email_params)
            
            api_instance.send_transac_email(customer_email)
            api_instance.send_transac_email(admin_email_obj)
            
            print(f"Successfully sent emails to customer and admin")
            return True
            
        except ApiException as e:
            print(f"Exception when calling Brevo API: {e.body if hasattr(e, 'body') else str(e)}")
            return False
                
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False