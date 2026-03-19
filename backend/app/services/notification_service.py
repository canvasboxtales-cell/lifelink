from fastapi import BackgroundTasks
from typing import List


async def send_email_notification(to_email: str, subject: str, body: str):
    """Send email notification (stub - implement with fastapi-mail in production)."""
    print(f"[EMAIL] To: {to_email} | Subject: {subject}")


async def notify_donors_of_urgent_request(
    background_tasks: BackgroundTasks,
    donor_emails: List[str],
    hospital_name: str,
    blood_type: str,
):
    for email in donor_emails:
        background_tasks.add_task(
            send_email_notification,
            to_email=email,
            subject=f"Urgent Blood Request - {blood_type} needed at {hospital_name}",
            body=f"There is an urgent need for {blood_type} blood at {hospital_name}. Please log in to LifeLink to respond.",
        )


async def notify_hospital_of_match(
    background_tasks: BackgroundTasks,
    hospital_email: str,
    donor_name: str,
    blood_type: str,
):
    background_tasks.add_task(
        send_email_notification,
        to_email=hospital_email,
        subject=f"Donor Match Confirmed - {blood_type}",
        body=f"Donor {donor_name} has confirmed availability to donate {blood_type} blood.",
    )
