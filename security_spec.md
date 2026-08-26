# Security Specification: Laura Luíza Beauty Firebase Integration

## 1. Data Invariants
1. Services in the salon catalog can be viewed by all visitors, but can only be modified or created by authorized administrators (`guseletrico2005@gmail.com` or documents in `/admins`).
2. Appointments can be created by clients with valid names, phone numbers, valid dates and existing service details.
3. Once an appointment is created, clients or administrators may update its status (e.g., from 'Confirmado' to 'Cancelado' or 'Concluído').
4. Document IDs must conform to alphanumeric characters and dashes (`^[a-zA-Z0-9_-]+$`) and be limited to 128 bytes to prevent ID Poisoning and Denial of Wallet attacks.

## 2. The Dirty Dozen Payloads (Rejection Test Cases)
1. **Malicious Service Injection**: An unauthenticated user attempts to create a fake service with price 0.
2. **Admin Spoofing**: A non-admin user attempts to create an admin record for themselves in `/admins/{uid}`.
3. **ID Poisoning in Appointments**: Injecting a 2MB junk string as the appointment ID.
4. **Negative Price Attack**: Submitting an appointment with negative price `-500`.
5. **Ghost Field Poisoning**: Sending an update with hidden administrative flags `isAdmin: true` into a user or appointment document.
6. **State Skip Attack**: Trying to inject an unsupported status value `status: 'HACKED'`.
7. **Cross-User Profile Hijack**: Modifying another user's profile under `/users/{victimId}` without admin privilege.
8. **Invalid Category in Service**: Creating a service with category `'crypto'`.
9. **Oversized String in Client Name**: Submitting a name exceeding 200 characters.
10. **Orphaned Status Update**: Updating an appointment without preserving immutable fields (`id`, `createdAt`).
11. **Non-Existent Document Write**: Deleting the entire services collection from client side without admin auth.
12. **Blanket Collection Scrape Attack**: Unauthorized deletion of other users' sensitive contact data.

## 3. Security Rules Design
- Attribute-Based Access Control (ABAC)
- Strict length and type validators (`isValidService`, `isValidAppointment`, `isValidUser`, `isValidId`)
- Catch-all default deny on all other paths.
