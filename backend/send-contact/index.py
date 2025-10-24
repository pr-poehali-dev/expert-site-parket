'''
Business: Send contact form data to email via SMTP
Args: event with POST body containing name, phone, email, message
Returns: HTTP response with success/error status
'''

import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from pydantic import BaseModel, EmailStr, Field, ValidationError


class ContactForm(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)
    email: EmailStr
    message: str = Field(..., min_length=1)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request body
    body_data = json.loads(event.get('body', '{}'))
    
    # Validate with Pydantic
    form = ContactForm(**body_data)
    
    # Get SMTP credentials from environment
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    email_to = os.environ.get('EMAIL_TO')
    
    # Create email message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта от {form.name}'
    msg['From'] = smtp_user
    msg['To'] = email_to
    
    # Email body
    html = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #8B4513;">Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> {form.name}</p>
        <p><strong>Телефон:</strong> {form.phone}</p>
        <p><strong>Email:</strong> {form.email}</p>
        <p><strong>Сообщение:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #8B4513;">
          {form.message}
        </p>
      </body>
    </html>
    '''
    
    part = MIMEText(html, 'html')
    msg.attach(part)
    
    # Send email
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'success': True, 'message': 'Заявка успешно отправлена'})
    }
