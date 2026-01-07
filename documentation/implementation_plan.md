# Implementation Plan: Reputation UI & Chat Moderation

We will implement the missing Reputation display on the user profile and enforce the "Allow Links" moderation setting in the chat.

## User Review Required

> [!NOTE]
> We will add a new "Reputation" card to the Profile Sidebar.

## Proposed Changes

### 1. Profile Feature (Reputation)

#### [MODIFY] [page.tsx](file:///d:/VSK/EntropyLabs/FINDMYSTUFF/src/app/profile/page.tsx)
-   Refactor `ProfilePage` to fetch user's `reputation` using `prisma.reputation.findUnique`.
-   Pass the `reputation` object to `ProfileDashboard`.

#### [MODIFY] [ProfileDashboard.tsx](file:///d:/VSK/EntropyLabs/FINDMYSTUFF/src/components/ProfileDashboard.tsx)
-   Update `ProfileDashboardProps` to include `reputation`.
-   Add a "Trust Score" card in the `<aside>` section displaying:
    -   Karma Score (`score`)
    -   Successful Handoffs count
    -   Badges (render as pills)

### 2. Chat Feature (Moderation)

#### [MODIFY] [MaskedChat.tsx](file:///d:/VSK/EntropyLabs/FINDMYSTUFF/src/components/chat/MaskedChat.tsx)
-   Add a `URL_REGEX` constant.
-   In `sendMessage()`:
    -   Check if `thread.allowLinks` is `false`.
    -   If false, test content against `URL_REGEX`.
    -   If match found, block request and show error notification: "Links are disabled in this thread for safety."

## Verification Plan

### Automated Tests
-   None (Visual/Interaction only).

### Manual Verification
1.  **Reputation UI**:
    -   Go to `/profile`.
    -   Verify the Sidebar shows a "Trust Score" card.
    -   Since stats might be 0, verify it renders "0" gracefully.
2.  **Chat Moderation**:
    -   Open a chat (e.g., as a finder).
    -   Ensure `allowLinks` is false (default).
    -   Try sending "Check this google.com".
    -   Verify error toast appears and message is NOT sent.
    -   Try sending "Hello world".
    -   Verify it sends.
