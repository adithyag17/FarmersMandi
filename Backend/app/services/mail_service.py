import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def generate_email_body(order):
    """
    Generate an email body from an Order object.
    
    Args:
        order (Order): Order object from database
        
    Returns:
        str: Formatted email body
    """
    # Format the header
    email_body = "Thank you for your order!\n\n"
    email_body += f"Order ID: {order.order_id}\n"
    email_body += "Order Details:\n"
    email_body += "-------------\n\n"
    
    # Format each item
    email_body += "Items:\n"
    for product in order.products:
        email_body += f"- {product['product_name']} (Qty: {product['quantity']}) - ${product['price']/100:.2f} each\n"
    
    # Format the total with proper currency formatting
    # Assuming total_order_price is in cents
    total_dollars = order.total_order_price / 100
    
    email_body += f"\nDelivery Address: {order.delivery_address}\n"
    email_body += f"Total Amount: ${total_dollars:.2f}\n\n"
    
    email_body += "Your order will be delivered soon. Thank you for shopping with us!\n"
    email_body += "If you have any questions, please contact our customer service."
    
    return email_body

def send_order_email(email_body, sender_email, sender_name, receiver_email, subject="Your Order Confirmation", api_key=None):
    # Configure API key
    if api_key is None:
        api_key = "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"
    
    # Configure API client
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = api_key
    
    # Create an instance of the TransactionalEmailsApi class
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    
    # Define sender
    sender = {"name": sender_name, "email": sender_email}
    
    # Define recipient
    to = [{"email": receiver_email}]
    
    # Create email object
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=f"<html><body>{email_body.replace('\n', '<br>')}</body></html>",
        text_content=email_body
    )
    
    # Make the API call
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        return api_response
    except ApiException as e:
        return {"error": f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}"}
