Refactor the search interaction into a Netflix-style in-header expanding search experience with stable positioning and real-time results. Do not create a separate search page or floating modal.

1. HEADER SEARCH EXPANSION:

* When user clicks the search icon in the header, expand the search input horizontally from the icon.
* Expansion direction: leftwards from the icon.
* Expanded width: approximately 320px–420px depending on available space.
* The search input MUST be placed inside the header container, aligned vertically with logo, navigation, and icons.
* Maintain consistent header padding and grid alignment.
* The input must feel like part of the header, not floating.

2. SEARCH INPUT DESIGN:

* Height: 40–44px

* Border radius: match existing input/button radius (8px–12px)

* Include:

  * Left: search icon inside input (16px–20px)
  * Center: text input
  * Right: clear “X” button (visible when typing)

* Placeholder:
  “Search films, creators, or genres…”

* Add subtle border or surface contrast (light gray or slightly elevated background)

3. CRITICAL POSITIONING RULE (FIX DRIFT ISSUE):

* The search input must remain FIXED in position inside the header.
* It must NOT shift vertically or horizontally when typing or when results appear.
* Do NOT center the input in the page body.
* Do NOT treat it as a floating or modal element.
* Header remains fixed at top of viewport.
* Only the results panel updates — not the input position.

4. INTERACTION BEHAVIOR:

* On click → input expands + auto-focus cursor
* Typing updates results in real time (no Enter required)
* Press Enter → optional: navigate to full results page
* Click outside → collapse search
* Press ESC → collapse search
* Clicking “X” clears input instantly

5. RESULTS PANEL (ANCHORED DROPDOWN):

* Appears directly BELOW the search input
* Must be anchored to the input (same left alignment and width)
* Vertical offset: 8px–12px only
* Width must EXACTLY MATCH the search input
* Use subtle shadow and slight surface elevation
* DO NOT dim the entire page
* DO NOT use a full-screen overlay
* The panel must feel connected to the header

6. RESULTS CONTENT STRUCTURE:

A. TOP MATCHES:

* Show 3–5 top results
* Layout:

  * Left: thumbnail (48x48 or 56x56)
  * Right: title + metadata (genre, year)

B. CATEGORY GROUPING:

* Group results into:

  * Films
  * Animation
  * Documentary
  * Creators

C. QUICK SUGGESTIONS:

* Show text suggestions based on input
* Example:
  SpongeBob Collection | SpongeBob Movie | SpongeBob Episodes

7. RESULT ITEM DESIGN:

* Each item has hover state:

  * subtle background highlight
  * slight elevation or color shift
* Cursor pointer on hover
* Clicking navigates to the featured page

8. SCROLL BEHAVIOR:

* Max height: 320px–400px
* Enable internal vertical scroll if needed
* Results scroll inside dropdown only
* The search input and header must NOT move

9. REMOVE INCORRECT BEHAVIOR:

* Remove separate search page behavior on click
* Remove “X results found” text
* Do NOT allow layout shifts
* Do NOT allow the search input to move or reposition

10. VISUAL CONSISTENCY:

* Follow existing typography, spacing, and color system
* Align with 12-column grid
* Match homepage horizontal padding
* Do not introduce new colors

11. MICRO-INTERACTIONS:

* Input expansion: 180–220ms ease-out
* Results fade/slide in: 150–200ms
* Keep animations subtle and smooth

GOAL:
Search should feel fast, stable, and integrated into the header — similar to Netflix — where users can explore content instantly without leaving context or experiencing layout shifts.
