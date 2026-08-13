Fix the search interaction layout so the search input, close icon, and results dropdown behave as one clean, anchored system inside the header. Do not redesign the visual style. Only fix alignment, placement, spacing, and structural consistency.

SEARCH SYSTEM ANCHOR RULE:
Treat the expanded search as one unified header component. The search input and its dropdown must be anchored to the same alignment frame inside the header, not floating independently over the page.

1. HEADER SEARCH POSITION

* Keep the search system inside the header row.
* Vertically center the search input to the same optical baseline as the navigation links, notification icon, and profile icon.
* The input should sit in the right-side action zone of the header, not drift into the center of the page.
* Maintain one clear horizontal relationship:
  nav links → search input → close icon → notification → profile
* Keep equal vertical alignment for all of these.

2. SEARCH INPUT DIMENSIONS

* Height: 40px to 44px only
* Width when expanded: 320px to 360px
* Border radius: same as existing input system
* The input must not be taller than surrounding header controls.
* Keep the input visually balanced with the header height.

3. SEARCH INPUT HORIZONTAL PLACEMENT

* Align the RIGHT EDGE of the expanded search input to a fixed header grid line.
* The close “X” icon must sit 20px to 24px to the right of the search input, not floating too far away.
* The gap between the search input and close icon must be consistent and intentional.
* The input must not collide with the navigation links on the left or icons on the right.

4. CLOSE ICON PLACEMENT

* The close icon must be vertically centered with the search input.
* It should feel like part of the same search control group.
* Do not place it too high or too low relative to the input.
* Keep its clickable area consistent with header icon spacing.

5. RESULTS DROPDOWN ANCHORING

* The results panel must appear directly BELOW the search input.
* The LEFT EDGE of the dropdown must exactly match the LEFT EDGE of the search input.
* The RIGHT EDGE of the dropdown must exactly match the RIGHT EDGE of the search input.
* The dropdown width must be identical to the search input width.
* Do not let the dropdown become wider, narrower, or offset.

6. RESULTS DROPDOWN VERTICAL OFFSET

* Place the dropdown 8px to 12px below the search input.
* It must feel attached to the search field, like one component.
* Do not leave a large gap.
* Do not let it overlap the input.

7. RESULTS PANEL STRUCTURE

* The dropdown should use internal padding of 16px to 20px on all sides.
* Section labels like “Animation” and “Documentary” should align to the same left text edge.
* Result rows must align consistently:
  thumbnail left
  title and metadata right
* Keep equal spacing between result groups.
* Keep “View all results” aligned to the panel’s bottom-right padding line.

8. RESULTS PANEL VISUAL BALANCE

* The dropdown should not feel like it is floating over the hero randomly.
* It must visually read as a header-attached search panel.
* Use subtle shadow and surface contrast only.
* No full-screen overlay.
* No large centered modal behavior.

9. PAGE RELATIONSHIP

* The homepage content behind the dropdown can remain visible.
* But the search system must still feel dominant and stable.
* The search input must never shift position when results update.
* Only the contents inside the dropdown are allowed to change.

10. STABILITY RULE

* Typing should update results in real time.
* The search bar itself must remain locked in place.
* The dropdown must remain locked to the search bar.
* No drifting, jumping, recentering, or independent movement.

11. ALIGNMENT PRECISION

* The search input, close icon, and dropdown must all follow the same invisible vertical axis system.
* Think of them as one component group, not three separate elements.
* Prioritize optical alignment over arbitrary centering.

12. FINAL GOAL
    The final interaction should feel like:

* a premium in-header search
* stable
* anchored
* aligned to the header grid
* visually connected
* not floating
* not modal
* not misaligned

Do not change the site’s design language. Only fix structure, anchoring, spacing, and alignment.
