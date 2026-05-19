# 💍 Indian Wedding Invitation Website

A beautiful, interactive Indian-style wedding invitation with:
- 🌸 Falling rose petal animation
- ⏳ Live countdown timer
- 🎴 Scratch card to reveal wedding date
- 📅 Event cards (Haldi / Wedding / Reception)
- 🗺️ Interactive Google Maps with venue switcher
- 📸 Styled photo gallery grid
- 💌 RSVP form
- 📱 Fully responsive (mobile, tablet, laptop)

---

## 🚀 Run Locally (Python)

You need **Python 3.6+** — that's it. No npm, no pip installs.

```bash
# 1. Navigate to the project folder
cd wedding_invitation

# 2. Start the server (auto-opens browser)
python server.py
```

Then visit → **http://localhost:8080**

Press `Ctrl + C` to stop.

---

## 📁 Project Structure

```
wedding_invitation/
├── index.html     ← Main HTML structure
├── style.css      ← All styles (colors, layout, animations)
├── app.js         ← All interactivity (petals, countdown, scratch, map, RSVP)
├── server.py      ← Python local dev server
└── README.md      ← This file
```

---

## ✏️ Customisation Guide

### 1. Change the couple's names
In `index.html`, search for **"Priya"** and **"Arjun"** — replace everywhere.

### 2. Change wedding date
In `app.js`, line ~55:
```js
const weddingDate = new Date('2026-02-14T07:00:00+05:30').getTime();
```
Update to your actual date + IST offset `+05:30`.

### 3. Change event details
In `index.html`, inside the `events-section`, update each `.event-card`'s date, time, venue, and dress code.

### 4. Change venue map
In `app.js`, update the `venues` object:
```js
const venues = {
  wedding: {
    name: 'Your Venue Name',
    addr: 'Your Address',
    map:  'https://maps.google.com/maps?q=YOUR+VENUE&output=embed',
    link: 'https://maps.google.com/?q=YOUR+VENUE',
  },
  ...
};
```

### 5. Change colours / theme
All colours are CSS variables at the top of `style.css`:
```css
:root {
  --maroon: #7B1C2E;
  --gold:   #C9922A;
  --rose:   #E8A0B0;
  ...
}
```

### 6. Add real photos
Replace the `.gallery-card` gradient placeholders in `style.css` by adding actual images. Example:
```css
.g1 { background: url('photos/haldi.jpg') center/cover; }
```

---

## 📱 Responsive Breakpoints
| Device  | Width       | Layout         |
|---------|-------------|----------------|
| Mobile  | < 480px     | Single column  |
| Tablet  | 480–768px   | 2-column grid  |
| Laptop  | > 768px     | Full grid      |

---

## 🌐 Deploy Online (Optional)
Drop the `index.html`, `style.css`, and `app.js` files into any static host:
- **GitHub Pages** (free)
- **Netlify** (free, drag & drop)
- **Vercel** (free)
- **Firebase Hosting** (free tier)

No build step needed — it's pure HTML/CSS/JS.
