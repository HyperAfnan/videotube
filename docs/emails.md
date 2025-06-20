# 📧 Email System Overview

This document outlines the email-related flows in the application, including registration, confirmation, welcome emails, and password reset functionality. The system uses Redis-based **Bull queues** for asynchronous email processing with **workers**, **retry logic**, and **dead-letter queues (DLQs)** for failure handling.

---

## ✅ Registration Email Flow

### 1. User Registration
- `POST /api/v1/user/register`
- Server actions:
  - Generates a confirmation token.
  - Stores a *temporary user* in the database.
  - Triggers the email service to send a confirmation email.

### 2. Sending Confirmation Email
- Email service:
  - Adds the email job to a **Bull queue** (Redis).
  - A **worker** processes the job:
    - ✅ If successful: job marked *completed*.
    - ❌ If failed:
      - Sent to **dead-letter queue (DLQ)**.
      - DLQ worker retries after a delay.
      - If still failed: marked *failed*.

### 3. Temporary User Cleanup
- Server schedules a cleanup job after 1 hour:
  - Job added to a **Bull queue**.
  - A worker checks if the user is still unverified.
  - If so, deletes the user from the database.

---

## 🔗 Email Confirmation Flow

- `GET /api/v1/user/confirmEmail/{confirmationToken}`

Server actions:
- Verifies the confirmation token.
- Marks the user as *confirmed* in the database.
- Generates:
  - ✅ Access token
  - 🔄 Refresh token
- Stores the access token in the database.
- Sends both tokens in the response.

---

## 🎉 Welcome Email Flow

After successful email confirmation:
- Server calls the email service to send a **welcome email**.
- Follows the same Bull queue flow as above:
  - Job added → worker processes → success/failure → DLQ → retries → final status.

---

## 🔐 Password Reset Flow

### 1. Password Reset Request
- `POST /api/v1/user/forgotPassword`
- If user exists:
  - Generate a password reset token.
  - Store the token in the database.
  - Send a password reset email (via Bull queue).

### 2. Password Reset Confirmation
- `POST /api/v1/user/resetPassword/{token}`
- Request includes:
  - Password reset token
  - New password

Server actions:
- Verifies the token.
- If valid:
  - Updates the user's password.
  - Deletes the token from the database.
  - Sends success response.

---
