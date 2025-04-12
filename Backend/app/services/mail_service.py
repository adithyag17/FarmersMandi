# import os
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# import sib_api_v3_sdk
# from sib_api_v3_sdk.rest import ApiException
# from dotenv import load_dotenv
# load_dotenv() 

# def generate_email_body(order):
#     """
#     Generate an email body from an Order object.

#     Args:
#         order (Order): Order object from database

#     Returns:
#         str: Formatted email body
#     """
#     # Format the header
#     email_body = "Thank you for your order!\n\n"
#     email_body += f"Order ID: {order.order_id}\n"
#     email_body += "Order Details:\n"
#     email_body += "-------------\n\n"

#     # Format each item
#     email_body += "Items:\n"
#     for product in order.products:
#         email_body += f"- {product['product_name']} (Qty: {product['quantity']}) - ${product['price'] / 100:.2f} each\n"

#     # Format the total
#     total_dollars = order.total_order_price / 100
#     email_body += f"\nDelivery Address: {order.delivery_address}\n"
#     email_body += f"Total Amount: ${total_dollars:.2f}\n\n"

#     email_body += "Your order will be delivered soon. Thank you for shopping with us!\n"
#     email_body += "If you have any questions, please contact our customer service."

#     return email_body

# def send_order_email(email_body, sender_email, sender_name, receiver_email, subject="Your Order Confirmation"):
#     # Load API key from environment variable
#     api_key = os.getenv("SENDINBLUE_API_KEY")
#     if not api_key:
#         raise ValueError("SENDINBLUE_API_KEY environment variable not set")

#     # Configure API client
#     configuration = sib_api_v3_sdk.Configuration()
#     configuration.api_key['api-key'] = api_key

#     api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

#     sender = {"name": sender_name, "email": sender_email}
#     to = [{"email": receiver_email}]

#     send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
#         to=to,
#         sender=sender,
#         subject=subject,
#         html_content=f"<html><body>{email_body.replace('\n', '<br>')}</body></html>",
#         text_content=email_body
#     )

#     try:
#         api_response = api_instance.send_transac_email(send_smtp_email)
#         return api_response
#     except ApiException as e:
#         return {"error": f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}"}
