/* CodeQuest: English text for the chapters (Bahasa Indonesia is the original, in js/game.js).
   Each entry mirrors the text fields of BAB[i]; the game copies them in when English is chosen. */
window.CQ_BAB_EN = [];

/* CodeQuest: English text for Bab 1 (Bu Sari) */
CQ_BAB_EN[0] = {
  klien: {
    nama: 'Bu Sari', usaha: 'Warung Kopi Senja',
    kirimTeks: "I've updated it, Bu. Please take a look 🙏",
    revisiBuka: "I've had a look. But ", revisiDaftar: 'a few things are still missing:', revisiTutup: 'Please check it again, okay? No rush ☕'
  },
  hadiah: { teks: "Bu Sari also sent a photo of her warung in a little frame. It's on your desk now." },
  penutup: {
    judul: 'First project done',
    teks: "You built the Warung Kopi Senja website all by yourself, from a blank page to ready to open on customers' phones."
  },
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Warung Kopi Senja</title>
</head>
<body>

</body>
</html>
`,
  tugas: [
  {
    judul: "The warung's signboard",
    pesan: [
      "Good afternoon, {nama}! I'm Sari, I own Warung Kopi Senja 😊",
      "My kid says a warung needs a website these days. I don't understand any of this, so I'm leaving it to you, okay?",
      "To start, just write the warung's name in big letters: Warung Kopi Senja.\nUnder it, write our opening hours, 07.00 to 22.00."
    ],
    reqs: [
      { label: 'Big heading: Warung Kopi Senja', ask: "the warung's name isn't there as a big heading yet" },
      { label: 'Only one big heading on the page', ask: 'why is there more than one big heading' },
      { label: 'Paragraph with opening hours 07.00 to 22.00', ask: "the opening hours (07.00 to 22.00) aren't showing yet" }
    ],
    catatan: {
      teks: 'Everything shown on the page is written inside <code>&lt;body&gt;</code>. The main heading uses <code>&lt;h1&gt;</code> and should only be used once per page, because search engines read it as the most important heading. Ordinary sentences are written with <code>&lt;p&gt;</code> (paragraph). Every tag is opened, then closed with a slash.',
      contoh: '<body>\n  <h1>Toko Roti Pagi</h1>\n  <p>Open every day.</p>\n</body>',
      petunjuk: ['Put both lines between <body> and </body>.', '<h1>Warung Kopi Senja</h1>\n<p>Open every day, 07.00 - 22.00</p>']
    },
    sukses: ["Wow, the name is up! I showed my husband, and he couldn't stop smiling 😄", "I'll transfer a down payment first, okay?"]
  },
  {
    judul: 'Menu list',
    pesan: [
      'Now the menu, please. Give it a small heading, "Menu", then the list goes like this:',
      'Kopi Tubruk – Rp8.000\nEs Kopi Susu – Rp15.000\nTeh Tarik – Rp10.000\nPisang Goreng – Rp12.000',
      "Don't forget the prices, okay? My customers like to ask the price first 😅"
    ],
    reqs: [
      { label: 'Small heading that says Menu', ask: 'the small "Menu" heading isn\'t there yet' },
      { label: 'Four menu items as a list', ask: "the menu isn't arranged as a list of four items yet" },
      { label: 'Kopi Tubruk and Pisang Goreng are there', ask: 'the Kopi Tubruk or the Pisang Goreng is missing' },
      { label: 'Every menu item has a price (Rp)', ask: "some menu items still don't have a price" }
    ],
    catatan: {
      teks: 'Section headings use <code>&lt;h2&gt;</code>, one level below <code>&lt;h1&gt;</code>. A list without numbers is written with <code>&lt;ul&gt;</code> (unordered list), and each line is wrapped in <code>&lt;li&gt;</code> (list item). If the order matters, use <code>&lt;ol&gt;</code>.',
      contoh: '<h2>Bread</h2>\n<ul>\n  <li>Roti Tawar – Rp12.000</li>\n  <li>Roti Cokelat – Rp9.000</li>\n</ul>',
      petunjuk: ['Write it below the opening hours paragraph. One <li> for each menu item.', '<h2>Menu</h2>\n<ul>\n  <li>Kopi Tubruk – Rp8.000</li>\n  <li>Es Kopi Susu – Rp15.000</li>\n  <li>Teh Tarik – Rp10.000</li>\n  <li>Pisang Goreng – Rp12.000</li>\n</ul>']
    },
    sukses: ['Now this is really neat. The pisang goreng looks fancy now, hehe.', "This is for today's work."]
  },
  {
    judul: 'WhatsApp button',
    pesan: [
      'Customers often ask, can they order through WA?',
      'Could you make some text, "Order via WhatsApp", that opens my WA straight away when tapped? My number is 0812-3456-7890.',
      "Oh, and if you can, make it open in a new tab, so the website doesn't disappear."
    ],
    reqs: [
      { label: 'Link to WhatsApp (wa.me)', ask: "the text isn't connected to WhatsApp yet" },
      { label: 'Number in international format: 62, no leading 0, no dashes', ask: "when I tapped it, the number couldn't be found. Maybe the format isn't right yet" },
      { label: 'Link text: Order via WhatsApp', ask: 'the "Order via WhatsApp" text isn\'t there yet' },
      { label: 'Opens in a new tab', ask: 'when I tap it, the website closes instead. I want it in a new tab' }
    ],
    catatan: {
      teks: 'Links use <code>&lt;a&gt;</code> with an <code>href</code> attribute that holds the destination address. For WhatsApp the address is <code>https://wa.me/</code> followed by the number in international format: country code 62, the leading zero dropped, no spaces or dashes. So 0811-2222-333 becomes 628112222333. The <code>target="_blank"</code> attribute opens the link in a new tab.',
      contoh: '<a href="https://wa.me/628112222333" target="_blank">Chat with us</a>',
      petunjuk: ['0812-3456-7890 → drop the leading 0, add 62, remove the dashes.', '<p><a href="https://wa.me/6281234567890" target="_blank">Order via WhatsApp</a></p>']
    },
    sukses: ['I just tried tapping it, and it went straight to my own WA! So clever 😆', "Thank you, I'm sending your payment now."]
  },
  {
    judul: 'Sunset colors',
    pesan: [
      'Why is the website so plain white, like a photocopy 😅',
      'Could you make it feel warm? Sunset colors, you know: coffee brown, cream, a little orange. Up to you, I trust your taste.',
      'And not such a stiff font, please.'
    ],
    reqs: [
      { label: "Page background isn't plain white", ask: 'the background is still plain white' },
      { label: 'Big heading has its own color', ask: 'the heading is still plain black' },
      { label: 'Font changed (font-family)', ask: "the letters are still in that stiff font" }
    ],
    catatan: {
      teks: "CSS controls how things look. The easiest way: write a <code>&lt;style&gt;</code> tag inside <code>&lt;head&gt;</code>. Each rule is made of a selector (the element being styled), then properties and their values inside curly braces. Colors can be written as hex codes like <code>#6B4226</code>. For fonts, give several choices: if the first one isn't available, the browser uses the next one.",
      contoh: '<style>\n  body {\n    background-color: #FFF4E0;\n    font-family: Georgia, serif;\n  }\n  h1 {\n    color: #8B4513;\n  }\n</style>',
      petunjuk: ['Put <style> before </head>. Style body for the background and font, and h1 for the heading color.', '<style>\n  body {\n    background-color: #F6E7D0;\n    color: #3B2A20;\n    font-family: Georgia, "Times New Roman", serif;\n  }\n  h1 {\n    color: #B5562B;\n  }\n</style>']
    },
    sukses: ['This is it! It feels like my warung at five in the afternoon 🥹', 'My kid even asked, "Who made this, Mom?" I said: {nama}.']
  },
  {
    judul: 'Order button',
    pesan: [
      'My kid had an idea: make an "Order now" button.',
      "When it's tapped, a thank-you message shows up. So customers feel welcome, my kid says.",
      "I don't know if that's hard or not, hehe. Take your time."
    ],
    reqs: [
      { label: 'Button that says Order now', ask: 'the "Order now" button isn\'t there yet' },
      { label: 'Written with JavaScript in a <script> tag', ask: "my kid says there's no JavaScript yet" },
      { label: 'After tapping, "Thank you" appears', ask: "I tapped the button, but the thank-you message doesn't show up" }
    ],
    catatan: {
      teks: 'JavaScript lets a page react. The basic pattern has three steps: grab an element with <code>document.getElementById</code>, attach a "listener" with <code>addEventListener(\'click\', ...)</code>, then change another element\'s content through <code>textContent</code>. The <code>&lt;script&gt;</code> tag goes at the bottom of <code>&lt;body&gt;</code>, so the elements it looks for already exist when the code runs.',
      contoh: '<button id="sapa">Say hi</button>\n<p id="balasan"></p>\n\n<script>\n  const tombol = document.getElementById("sapa");\n  tombol.addEventListener("click", function () {\n    document.getElementById("balasan").textContent = "Hi to you too!";\n  });\n<\/script>',
      petunjuk: ['You need three parts: a <button> with an id, an empty <p> with an id, then a <script> at the very bottom of body.', '<button id="pesan">Order now</button>\n<p id="info"></p>\n\n<script>\n  document.getElementById("pesan").addEventListener("click", function () {\n    document.getElementById("info").textContent = "Thank you! We are getting your order ready.";\n  });\n<\/script>']
    },
    sukses: ['I tapped it ten times, and ten times it said thank you 😂 Such a polite website.', "Here's the payment for the button."]
  },
  {
    judul: 'Neat on phone and laptop',
    pesan: [
      'One more thing. When I open it on my phone, the letters are really tiny, I have to pinch the screen to zoom.',
      "And on my kid's laptop, the text stretches all the way to the edge of the screen. It's tiring to read.",
      'Could you tidy it up? Once this is done, I want to put the website on the banner in front of the warung.'
    ],
    reqs: [
      { label: 'Meta viewport for phone screens', ask: 'on my phone the letters are still tiny' },
      { label: 'Page content has a limited width (max-width)', ask: 'on the laptop the text still stretches to the edge' }
    ],
    catatan: {
      teks: 'Without the <code>&lt;meta name="viewport"&gt;</code> tag, a phone shows the page as if its screen were as wide as a laptop, then shrinks it down. This tag goes in <code>&lt;head&gt;</code>. For wide screens, limit the content width with <code>max-width</code>, then center it with <code>margin: 0 auto</code>. Lines of text that are too long really do tire the eyes.',
      contoh: '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n/* inside <style> */\nbody {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 16px;\n}',
      petunjuk: ['Meta viewport goes in <head>, max-width goes in the body CSS rule you already made.', '<meta name="viewport" content="width=device-width, initial-scale=1">\n\nbody {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 16px;\n}']
    },
    sukses: ["I tried it on my phone and on my husband's phone. So easy to read!", 'A customer just told me, "Bu, your warung looks like a café in the city now." Thank you so much, {nama}. I\'ll tell my fellow vendors about you.']
  }
  ]
};

/* CodeQuest: English text for Bab 2 (Laras) */
CQ_BAB_EN[1] = {
  klien: {
    nama: 'Laras', usaha: 'Toko Bunga Laras',
    kirimTeks: "I've updated it, Kak Laras. Have a look 🙏",
    revisiBuka: 'Checked it! But ', revisiDaftar: "a few things aren't there yet:", revisiTutup: "No rush, I'll wait 🌷"
  },
  hadiah: { teks: "Laras also sent a small flower vase. It's on the windowsill now." },
  penutup: {
    judul: 'Second project done',
    teks: 'Toko Bunga Laras now has a navigation menu, a photo catalog, an order form, and product cards generated automatically from data. This is a real website now.'
  },
  pembuka: 'New project: Toko Bunga Laras. A fresh index.html file is ready.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Toko Bunga Laras</title>
  <style>
    body {
      background-color: #FBF3EE;
      color: #3A2E2A;
      font-family: Georgia, serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 16px;
    }
  </style>
</head>
<body>
  <h1>Toko Bunga Laras</h1>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Page skeleton',
    pesan: [
      "Hi {nama}! I'm Laras, from Toko Bunga Laras 🌷 Bu Sari told me a lot about you, she says you're really careful with your work.",
      "My shop is small, but online orders keep growing. I need a website that's more complete than Bu Sari's, hehe.",
      "Let's start with the skeleton. At the top there's a menu: Catalog, About, Contact. When you click one, it jumps straight to its own section."
    ],
    reqs: [
      { label: 'Menu inside <header> and <nav>', ask: "the top part doesn't have a menu yet (header and nav)" },
      { label: 'Catalog, About, and Contact links', ask: "the Catalog, About, and Contact menu isn't complete yet" },
      { label: 'Each link has a target <section> with a matching id', ask: "when I click the menu, it doesn't jump anywhere" }
    ],
    catatan: {
      teks: 'A bigger website needs to be split into parts. <code>&lt;header&gt;</code> is the head of the page, <code>&lt;nav&gt;</code> holds the menu, and each part of the content is wrapped in <code>&lt;section&gt;</code>. These tags are called semantic HTML: they look exactly the same as <code>&lt;div&gt;</code>, but screen readers and search engines understand how your page is organized. For links that jump within the same page, fill <code>href</code> with a hash sign and the target id: <code>href="#kontak"</code> jumps to the element that has <code>id="kontak"</code>.',
      contoh: '<header>\n  <nav>\n    <a href="#jadwal">Schedule</a>\n    <a href="#lokasi">Location</a>\n  </nav>\n</header>\n\n<section id="jadwal">\n  <h2>Schedule</h2>\n</section>\n<section id="lokasi">\n  <h2>Location</h2>\n</section>',
      petunjuk: ['Move the <h1> into a <header>, then add a <nav> with three links. Below it, make three <section>s with the ids katalog, tentang, and kontak (Indonesian for catalog, about, and contact).', '<header>\n  <h1>Toko Bunga Laras</h1>\n  <nav>\n    <a href="#katalog">Catalog</a>\n    <a href="#tentang">About</a>\n    <a href="#kontak">Contact</a>\n  </nav>\n</header>\n\n<section id="katalog">\n  <h2>Catalog</h2>\n</section>\n\n<section id="tentang">\n  <h2>About</h2>\n  <p>A small flower shop that arranges everything by hand, every day.</p>\n</section>\n\n<section id="kontak">\n  <h2>Contact</h2>\n</section>']
    },
    sukses: ['I clicked "Contact" and it jumped right down. So neat!', "Here's the down payment, {nama}."]
  },
  {
    judul: 'Product photos',
    pesan: [
      "The skeleton looks good. Now let's fill in the Catalog section.",
      "I'm sending photos of my three best-selling flowers. Don't mistype the file names, okay? Computers are super picky about letters.",
      'Oh, and give every photo a description. One of my regular customers is blind and browses websites with a screen reader.'
    ],
    reqs: [
      { label: 'Three photos in the Catalog section', ask: "there aren't three photos in the Catalog section yet" },
      { label: 'All photos show up (correct file names)', ask: "one of the photos isn't showing, just an empty box. Check the file name" },
      { label: 'Every photo has a description (alt)', ask: 'some photos still have no description, so the screen reader just stays silent' }
    ],
    catatan: {
      teks: 'Images are written with <code>&lt;img&gt;</code>, a tag that has no closing tag. The <code>src</code> attribute holds the image file name and must match exactly, including upper and lower case and the <code>.svg</code> ending. The <code>alt</code> attribute holds the image description: screen readers read it aloud, and it shows up if the image fails to load. Write what you can see, not "image1". Click a file name above the editor to insert it.',
      contoh: '<img src="kue-lapis.svg" alt="A slice of lapis legit cake with chocolate layers">',
      petunjuk: ['Put three <img> inside <section id="katalog">, below the <h2>. The file names: mawar.svg, tulip.svg, matahari.svg.', '<img src="mawar.svg" alt="A single red rose">\n<img src="tulip.svg" alt="A blooming yellow tulip">\n<img src="matahari.svg" alt="A big sunflower">']
    },
    sukses: ['So pretty! My friend just tried it with a screen reader, and heard "a single red rose" 🥹', "Thanks, I'm transferring it now."]
  },
  {
    judul: 'Product cards',
    pesan: [
      'The photos show up now, but they still look like they were just dropped anywhere 😅',
      'Could you turn them into cards? One flower, one card: photo, name, and price.\nMawar Merah – Rp25.000\nTulip Kuning – Rp30.000\nBunga Matahari – Rp20.000',
      'Give the cards a white background, some space inside, and rounded corners. So they feel soft.'
    ],
    reqs: [
      { label: 'Three cards with class="kartu"', ask: "there aren't three cards yet" },
      { label: 'Each card: photo, name (h3), and price', ask: 'some cards are still missing a photo, name, or price' },
      { label: 'Cards have padding and rounded corners', ask: 'the cards still look stiff, there is no space inside and the corners are still sharp' }
    ],
    catatan: {
      teks: 'The <code>class</code> attribute gives elements a group name, so many elements can be styled with a single CSS rule. Wrap the contents of one card in <code>&lt;div class="kartu"&gt;</code> ("kartu" means card). In CSS, a class selector starts with a dot: <code>.kartu</code>. The product name uses <code>&lt;h3&gt;</code>, because it sits below the section heading <code>&lt;h2&gt;</code>.',
      contoh: '<div class="kartu">\n  <img src="kue-lapis.svg" alt="Lapis legit cake">\n  <h3>Lapis Legit</h3>\n  <p>Rp45.000</p>\n</div>\n\n/* inside <style> */\n.kartu {\n  background-color: white;\n  padding: 12px;\n  border-radius: 12px;\n}',
      petunjuk: ['Wrap each <img> together with its <h3> and its price <p> in one <div class="kartu">. Then add a .kartu rule inside <style>.', '<div class="kartu">\n  <img src="mawar.svg" alt="A single red rose">\n  <h3>Mawar Merah</h3>\n  <p>Rp25.000</p>\n</div>\n<!-- repeat for the tulip and the sunflower -->\n\n.kartu {\n  background-color: white;\n  padding: 12px;\n  border-radius: 12px;\n}']
    },
    sukses: ['Now this is a real flower shop! Neat, like a display window.', "I'm sending your payment."]
  },
  {
    judul: 'Cards side by side',
    pesan: [
      'The cards are all stacked on top of each other, customers have to scroll forever.',
      "On a laptop I want the cards lined up side by side, with space between them. On a phone they can drop down if they don't fit.",
      'One more thing: the cards should move a little when the cursor hovers over them. So they feel alive.'
    ],
    reqs: [
      { label: 'Cards line up side by side on a laptop', ask: 'the cards are still stacked on top of each other' },
      { label: 'Space between cards (gap)', ask: 'the cards are still squished together' },
      { label: "Cards wrap to a new row when they don't fit (flex-wrap or grid)", ask: 'on my phone the cards get cut off instead of dropping down' },
      { label: 'Cards react when hovered by the cursor (:hover)', ask: "the cards don't move yet when the cursor hovers over them" }
    ],
    catatan: {
      teks: 'Flexbox arranges the children of an element. Wrap all the cards in one <code>&lt;div&gt;</code>, then give that wrapper <code>display: flex</code>: its children line up side by side. <code>gap</code> adds space between them, and <code>flex-wrap: wrap</code> makes the cards drop to a new row when the screen is narrow. For the cursor effect, write a rule with <code>:hover</code>, and add <code>transition</code> so the movement is smooth.',
      contoh: '.galeri {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.foto {\n  transition: transform 0.2s;\n}\n.foto:hover {\n  transform: translateY(-4px);\n}',
      petunjuk: ['Wrap the three cards in <div class="daftar-produk">. Style .daftar-produk with flex, then .kartu:hover with transform.', '<div class="daftar-produk">\n  <!-- three cards here -->\n</div>\n\n.daftar-produk {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.kartu {\n  transition: transform 0.2s;\n}\n.kartu:hover {\n  transform: translateY(-4px);\n}']
    },
    sukses: ["I've been hovering over the cards this whole time, it's so cute how they bob up and down 😆", "Here's your payment. Now for the most important part."]
  },
  {
    judul: 'Order form',
    pesan: [
      'Now the most important part: an order form. Put it in the Contact section.',
      "It needs a field for the customer's name, a field for the message on the flower card, and a send button.",
      "The name field has to be required, okay? Last week a bouquet arrived without the sender's name, and the person who got it was so confused 😅"
    ],
    reqs: [
      { label: 'Form (<form>) in the Contact section', ask: "the form isn't in the Contact section yet" },
      { label: 'Name field with a label', ask: "the name field doesn't have a label yet, so customers don't know what it's for" },
      { label: 'Name field must be filled in (required)', ask: 'the name field can still be left empty' },
      { label: 'Message field (textarea)', ask: "the field for the card message isn't there yet" },
      { label: 'Send button', ask: "the send button isn't there yet" }
    ],
    catatan: {
      teks: "A form is wrapped in <code>&lt;form&gt;</code>. A one-line field uses <code>&lt;input&gt;</code>, a long field uses <code>&lt;textarea&gt;</code>. Every field needs a <code>&lt;label&gt;</code>: the label's <code>for</code> attribute must match the field's <code>id</code>. That way, clicking the label selects the field, and screen readers know what the field is for. The <code>required</code> attribute makes the browser refuse to send the form while that field is still empty.",
      contoh: '<form>\n  <label for="email">Email</label>\n  <input type="text" id="email" required>\n\n  <label for="catatan">Notes</label>\n  <textarea id="catatan"></textarea>\n\n  <button type="submit">Send</button>\n</form>',
      petunjuk: ['Put a <form> inside <section id="kontak">: one label and input for the name, one label and textarea for the message, then a button.', '<form id="form-pesan">\n  <label for="nama">Customer name</label>\n  <input type="text" id="nama" required>\n\n  <label for="ucapan">Message for the card</label>\n  <textarea id="ucapan"></textarea>\n\n  <button type="submit">Send order</button>\n</form>']
    },
    sukses: ['I tried sending it without a name, and it got rejected right away. Awesome!', "I've sent your payment."]
  },
  {
    judul: 'Order confirmation',
    pesan: [
      'I tried filling in the form and hit send... the page just blinked and went blank again 😵',
      'What I want: after sending, the page stays put, and a message appears saying "Thank you, [customer name]!" with the name that was just typed.',
      'So customers know for sure their order went through.'
    ],
    reqs: [
      { label: "After sending, \"Thank you\" appears with the customer's name", ask: 'I sent it with the name Rani, and no thank-you for Rani showed up' },
      { label: "The page doesn't reload (preventDefault)", ask: 'the page still blinks and goes blank after sending' }
    ],
    catatan: {
      teks: "By default, the browser sends a form by reloading the page. To handle it yourself, listen for the <code>submit</code> event on the form, then call <code>event.preventDefault()</code> to cancel that default behavior. A field's content is read through <code>.value</code>. The neatest way to combine text is a template literal: the text is wrapped in backticks (<code>`</code>), and values are inserted with <code>${...}</code>.",
      contoh: '<script>\n  const form = document.getElementById("daftar");\n  form.addEventListener("submit", function (event) {\n    event.preventDefault();\n    const kota = document.getElementById("kota").value;\n    document.getElementById("hasil").textContent = `See you in ${kota}!`;\n  });\n<\/script>',
      petunjuk: ['Set up <p id="konfirmasi"></p> below the form, then write a <script> at the end of <body>.', '<p id="konfirmasi"></p>\n\n<script>\n  const form = document.getElementById("form-pesan");\n  form.addEventListener("submit", function (event) {\n    event.preventDefault();\n    const nama = document.getElementById("nama").value;\n    document.getElementById("konfirmasi").textContent = `Thank you, ${nama}! We are arranging your order now.`;\n  });\n<\/script>']
    },
    sukses: ["I tried it with my mom's name, and the website said thank you to my mom 😭 So sweet.", "Here's your payment. Just one last request, I promise!"]
  },
  {
    judul: 'Catalog from data',
    pesan: [
      "Good news: next week I'm starting to sell Lili Putih, Rp35.000. I'm sending the photo.",
      "But I'll be changing products a lot. Do I really have to write a card from scratch every time?",
      "My programmer friend says the product data can go in a JavaScript list, and then the cards get made automatically. That's doable, right? Just delete the cards that were written by hand."
    ],
    reqs: [
      { label: 'Product data in a JavaScript array, looped with forEach or for', ask: "my friend says the data isn't in a JavaScript list yet" },
      { label: 'Cards created by JavaScript (delete the handwritten cards)', ask: 'the cards are still written by hand in the HTML' },
      { label: 'New product: Lili Putih Rp35.000', ask: "the Lili Putih isn't showing up yet" },
      { label: 'All cards complete and their photos show up', ask: "some cards have missing photos or aren't complete" }
    ],
    catatan: {
      teks: 'An array is a list of data in JavaScript, written between square brackets. Each product is written as an object in curly braces, holding pairs of names and values. <code>forEach</code> runs a function for every item in the array. Inside it, each card is built with a template literal, then added to the wrapper through <code>innerHTML +=</code>. After this, adding a product is just a matter of adding one line of data.',
      contoh: '<div id="daftar-kue"></div>\n\n<script>\n  const kue = [\n    { nama: "Lapis Legit", harga: "Rp45.000" },\n    { nama: "Bolu Pandan", harga: "Rp30.000" }\n  ];\n  const wadah = document.getElementById("daftar-kue");\n  kue.forEach(function (k) {\n    wadah.innerHTML += `<div class="kartu"><h3>${k.nama}</h3><p>${k.harga}</p></div>`;\n  });\n<\/script>',
      petunjuk: ['Empty the card wrapper and give it an id. Make a product array with a name, price, and photo for each (including lili.svg), then build the cards with forEach.', '<div class="daftar-produk" id="daftar-produk"></div>\n\n<script>\n  const produk = [\n    { nama: "Mawar Merah", harga: "Rp25.000", foto: "mawar.svg", alt: "A single red rose" },\n    { nama: "Tulip Kuning", harga: "Rp30.000", foto: "tulip.svg", alt: "A blooming yellow tulip" },\n    { nama: "Bunga Matahari", harga: "Rp20.000", foto: "matahari.svg", alt: "A big sunflower" },\n    { nama: "Lili Putih", harga: "Rp35.000", foto: "lili.svg", alt: "A white lily" }\n  ];\n  const wadah = document.getElementById("daftar-produk");\n  produk.forEach(function (p) {\n    wadah.innerHTML += `\n      <div class="kartu">\n        <img src="${p.foto}" alt="${p.alt}">\n        <h3>${p.nama}</h3>\n        <p>${p.harga}</p>\n      </div>`;\n  });\n<\/script>']
    },
    sukses: ['I tried adding one line of data myself, and the card showed up right away! I feel like a programmer 😆', 'Thank you so much, {nama}. The website is way better than I imagined.']
  }
  ]
};

/* CodeQuest: English text for Bab 3 (Bima, Ruang Nada) */
CQ_BAB_EN[2] = {
  klien: {
    nama: 'Bima', usaha: 'Ruang Nada',
    kirimTeks: 'Updated it, Mas Bima. Take a look 🙏',
    revisiBuka: 'Gave it a try. But ', revisiDaftar: 'a few things still aren\'t working:', revisiTutup: 'No rush, the café doesn\'t open till seven 🎶'
  },
  hadiah: { teks: 'Bima also sent an old guitar from his café. It\'s hanging on the studio wall now.' },
  penutup: {
    judul: 'Third project done',
    teks: 'Ruang Nada now has light and dark themes the browser remembers, a schedule read straight from a JSON file, a message for when it\'s offline, genre filters, and search. That\'s real front-end developer work.'
  },
  pembuka: 'New project: Ruang Nada. Bima\'s index.html file is open.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ruang Nada</title>
  <style>
    body {
      background-color: #F4EFE6;
      color: #22232E;
      font-family: system-ui, sans-serif;
      max-width: 880px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #C0533A;
    }
  </style>
</head>
<body>
  <header>
    <h1>Ruang Nada</h1>
    <p>A little café with live music every night.</p>
  </header>

  <section id="acara">
    <h2>This week's schedule</h2>
  </section>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Colors as variables',
    pesan: [
      'Good evening, {nama}. I\'m Bima, I run Ruang Nada, a little music café on a corner of town. Laras says you\'re someone I can count on.',
      'My website already exists, but the colors are written directly all over the place. Later on I want a light mode and a dark mode.',
      'So tidy it up first: gather the main colors into CSS variables in :root. At least a background color, a text color, and an accent color. Then use those variables on the page.'
    ],
    reqs: [
      { label: 'At least 3 color variables in :root', ask: 'the color variables aren\'t in :root yet' },
      { label: 'Body background and text use var()', ask: 'the body background and text colors are still written directly, not using var() yet' },
      { label: 'Accent color used on the heading', ask: 'the heading isn\'t using the accent color variable yet' }
    ],
    catatan: {
      teks: 'A CSS variable (custom property) is a name that stores a value. Its name starts with two dashes, for example <code>--latar</code> ("latar" means background), and it\'s usually written in <code>:root</code> so it applies to the whole page. You use its value with <code>var(--latar)</code>. If you want to change the color later, you only change one line in <code>:root</code>. This is the foundation of a dark mode feature.',
      contoh: ':root {\n  --utama: #2B6CB0;\n  --kertas: #FFFFFF;\n}\n\n.tombol {\n  background-color: var(--utama);\n  color: var(--kertas);\n}',
      petunjuk: ['Make a :root rule with --latar, --teks, and --aksen (background, text, accent) using the colors that are there now. Then replace the colors in body and h1 with var(...).', ':root {\n  --latar: #F4EFE6;\n  --teks: #22232E;\n  --aksen: #C0533A;\n}\n\nbody {\n  background-color: var(--latar);\n  color: var(--teks);\n  font-family: system-ui, sans-serif;\n  max-width: 880px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\nh1 {\n  color: var(--aksen);\n}']
    },
    sukses: ['Neat. I tried changing --aksen to purple, just one line, and the heading followed right away. You\'re great to work with.', 'I\'ve sent the down payment.']
  },
  {
    judul: 'Dark mode button',
    pesan: [
      'Now for the fun part.',
      'Make me a "Dark mode" button. Press it and the website goes dark. Press it again and it\'s back to light.',
      'My developer friend says the button just needs to add or remove one class on body. Then that class changes the variable values. No need to change the colors one by one.'
    ],
    reqs: [
      { label: 'Button that says Dark mode', ask: 'the "Dark mode" button isn\'t there yet' },
      { label: 'Pressed once: page goes dark', ask: 'I pressed the button and the page didn\'t go dark' },
      { label: 'Pressed again: back to light', ask: 'once it\'s dark, pressing it again doesn\'t bring it back to light' },
      { label: 'Uses classList and a class that changes the variables', ask: 'my friend says it\'s not using a class on body that changes the variables yet' }
    ],
    catatan: {
      teks: 'Since every color already uses a variable, dark mode can just be one class that overrides those variable values, for example <code>body.gelap { --latar: #16171F; }</code> ("gelap" means dark). In JavaScript, <code>classList.toggle("gelap")</code> adds the class if it isn\'t there yet, and removes it if it is. That one line is enough to make the button switch back and forth.',
      contoh: '.kotak.aktif {\n  --warna: #E53E3E;\n}\n\n<script>\n  document.getElementById("saklar").addEventListener("click", function () {\n    document.querySelector(".kotak").classList.toggle("aktif");\n  });\n<\/script>',
      petunjuk: ['Add a body.gelap rule that sets new values for --latar, --teks, and --aksen. Then make a button and a script with classList.toggle.', 'body.gelap {\n  --latar: #16171F;\n  --teks: #ECE8DF;\n  --aksen: #F2A65A;\n}\n\n<button id="tombol-mode">Dark mode</button>\n\n<script>\n  const tombolMode = document.getElementById("tombol-mode");\n  tombolMode.addEventListener("click", function () {\n    document.body.classList.toggle("gelap");\n  });\n<\/script>']
    },
    sukses: ['I\'ve been pressing it back and forth like a light switch 😄 The dark mode fits the late-night café vibe perfectly.', 'Your payment\'s gone through.']
  },
  {
    judul: 'Remember the mode',
    pesan: [
      'Customers love the dark mode, especially the ones browsing late at night.',
      'The problem is, every time the page is reopened, it\'s back to light. They have to keep pressing it again 😅',
      'Can it remember their choice? My friend says to use localStorage. I\'ll test it: pick dark, close it, then open it again.'
    ],
    reqs: [
      { label: 'Choice saved with localStorage.setItem', ask: 'the choice isn\'t being saved to localStorage yet' },
      { label: 'Reopened: dark mode is still on', ask: 'I picked dark, closed it, opened it again, and oops, it\'s light again' },
      { label: 'After reopening, the button can still switch back to light', ask: 'after reopening, the button can\'t switch back to light' }
    ],
    catatan: {
      teks: '<code>localStorage</code> is a small storage space in the browser that doesn\'t disappear when the page is closed. <code>localStorage.setItem("kunci", "nilai")</code> saves text ("kunci" is the key, "nilai" the value), and <code>localStorage.getItem("kunci")</code> reads it back (the result is <code>null</code> if nothing has been saved yet). So there are two steps: when the button is pressed, save the mode that\'s currently active. When the page opens, read the saved mode and apply it. <code>classList.contains</code> tells you whether a class is currently applied.',
      contoh: 'localStorage.setItem("bahasa", "id");\n\nif (localStorage.getItem("bahasa") === "id") {\n  document.body.classList.add("indonesia");\n}',
      petunjuk: ['At the start of the script, check localStorage.getItem("mode"). Inside the button click, save "gelap" or "terang" (dark or light) based on classList.contains.', '<script>\n  const tombolMode = document.getElementById("tombol-mode");\n\n  if (localStorage.getItem("mode") === "gelap") {\n    document.body.classList.add("gelap");\n  }\n\n  tombolMode.addEventListener("click", function () {\n    document.body.classList.toggle("gelap");\n    const mode = document.body.classList.contains("gelap") ? "gelap" : "terang";\n    localStorage.setItem("mode", mode);\n  });\n<\/script>']
    },
    sukses: ['Tested it on three phones. Pick dark, close, open again, still dark. Nice.', 'Here\'s your payment.']
  },
  {
    judul: 'Schedule from a JSON file',
    pesan: [
      'Now the thing that changes most often: the musician schedule. I\'ll send you the file, it\'s in JSON format.',
      'I change the schedule every week. So the website has to read that file directly, not have it written by hand in the HTML.',
      'Show it in the Schedule section, one box per event with the class "acara": day, musician, genre, time. Lay them out with CSS grid so it looks tidy.'
    ],
    reqs: [
      { label: 'Data loaded with fetch("jadwal.json")', ask: 'the schedule isn\'t being read from the jadwal.json file yet' },
      { label: 'Six events shown with class="acara"', ask: 'there aren\'t six event boxes showing yet' },
      { label: 'All musician names from the file are shown', ask: 'some musician names from the file aren\'t showing up' },
      { label: 'Event boxes laid out with CSS grid', ask: 'the event boxes aren\'t laid out with grid yet' },
      { label: 'No event boxes written by hand', ask: 'some events are still written by hand in the HTML' }
    ],
    catatan: {
      teks: 'JSON is a text format for storing data, and it looks a lot like JavaScript arrays and objects. <code>fetch("jadwal.json")</code> requests that file. The result isn\'t available right away because it has to wait for the network, so the function is marked <code>async</code> and every step that has to wait gets <code>await</code>. <code>await respon.json()</code> turns the JSON text into an array you can loop over with <code>forEach</code>. Click <code>jadwal.json</code> above the editor to see what\'s inside.',
      contoh: '<script>\n  async function muatMenu() {\n    const respon = await fetch("menu.json");\n    const menu = await respon.json();\n    menu.forEach(function (m) {\n      console.log(m.nama);\n    });\n  }\n  muatMenu();\n<\/script>',
      petunjuk: ['Make a <div id="jadwal" class="jadwal"></div> in the events section, a CSS grid rule for .jadwal, then an async function that fills in the boxes.', '<div id="jadwal" class="jadwal"></div>\n\n.jadwal {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 16px;\n}\n\n<script>\n  async function muatJadwal() {\n    const respon = await fetch("jadwal.json");\n    const daftar = await respon.json();\n    const wadah = document.getElementById("jadwal");\n    daftar.forEach(function (a) {\n      wadah.innerHTML += `\n        <div class="acara">\n          <strong>${a.hari}, ${a.tanggal}</strong>\n          <h3>${a.musisi}</h3>\n          <p>${a.genre}, ${a.jam}</p>\n        </div>`;\n    });\n  }\n  muatJadwal();\n<\/script>']
    },
    sukses: ['I changed one musician\'s name in the JSON file, and the website changed right along with it. This is exactly what I wanted!', 'Payment\'s been sent.']
  },
  {
    judul: 'When the signal is bad',
    pesan: [
      'Yesterday the signal at the café was bad, and the schedule section was completely empty. Customers thought there were no events 😟',
      'If the schedule fails to load, please show this message: "Schedule could not be loaded. Try reloading the page."',
      'I\'ll test it by turning off the internet, okay.'
    ],
    reqs: [
      { label: 'When online, the schedule still shows', ask: 'now the schedule doesn\'t show up at all, even with the internet on' },
      { label: 'When offline, "Schedule could not be loaded" appears', ask: 'when I turned off the internet, the "Schedule could not be loaded" message didn\'t show up' },
      { label: 'Error caught with try...catch (clean console)', ask: 'when offline, the console is still full of red errors' }
    ],
    catatan: {
      teks: 'The network can fail at any time, and good code is ready for that. Wrap the steps that might fail in <code>try { ... }</code>. If any line inside throws an error, JavaScript jumps straight to <code>catch (error) { ... }</code>. There you can show a friendly message instead of an empty page. The checker will run your website twice: once with internet, once without.',
      contoh: 'try {\n  const respon = await fetch("promo.json");\n  const promo = await respon.json();\n  tampilkan(promo);\n} catch (error) {\n  document.getElementById("promo").textContent = "Promo not available yet.";\n}',
      petunjuk: ['Move the contents of muatJadwal() inside try, then write the message in catch.', 'async function muatJadwal() {\n  const wadah = document.getElementById("jadwal");\n  try {\n    const respon = await fetch("jadwal.json");\n    const daftar = await respon.json();\n    daftar.forEach(function (a) {\n      wadah.innerHTML += `<div class="acara">...</div>`;\n    });\n  } catch (error) {\n    wadah.textContent = "Schedule could not be loaded. Try reloading the page.";\n  }\n}']
    },
    sukses: ['Tested it in airplane mode. The message shows up nice and politely. No more confused customers.', 'This is for today\'s work.']
  },
  {
    judul: 'Genre filter',
    pesan: [
      'My regulars all have their own taste. Some only want to see jazz.',
      'Add filter buttons: All, Jazz, Acoustic, Pop. If you press Jazz, only the jazz events show up.',
      'Don\'t fetch the data again every time a button is pressed. Store it in a variable first, then narrow it down with filter().'
    ],
    reqs: [
      { label: 'All, Jazz, Acoustic, and Pop buttons', ask: 'the genre filter buttons aren\'t all there yet' },
      { label: 'Press Jazz: only jazz events show', ask: 'I pressed Jazz and it\'s not just jazz showing' },
      { label: 'Press All: all six events show again', ask: 'after pressing All, the events don\'t all come back' },
      { label: 'Data filtered with filter()', ask: 'my friend says the data isn\'t being filtered with filter() yet' }
    ],
    catatan: {
      teks: '<code>filter()</code> makes a new array containing only the items that pass a condition. The condition is written as a function that returns <code>true</code> or <code>false</code>, often as an arrow function: <code>daftar.filter(a =&gt; a.genre === "Jazz")</code>. So you can reuse it, move the code that draws the boxes into its own function, for example <code>tampilkan(daftar)</code> ("tampilkan" means show), which empties the container first and then fills it. The <code>data-genre</code> attribute on a button can be read with <code>tombol.dataset.genre</code>. In Bima\'s data the acoustic genre is written "Akustik", so the Acoustic button uses <code>data-genre="Akustik"</code>.',
      contoh: 'const angka = [3, 8, 12, 5];\nconst besar = angka.filter(n => n > 6);\n// besar = [8, 12]\n\n<button data-warna="merah">Red</button>\n// tombol.dataset.warna === "merah"',
      petunjuk: ['Store the data in let semuaAcara = [] after the fetch. Make a function tampilkan(daftar). Add a click handler to each filter button.', '<div class="filter">\n  <button data-genre="Semua">All</button>\n  <button data-genre="Jazz">Jazz</button>\n  <button data-genre="Akustik">Acoustic</button>\n  <button data-genre="Pop">Pop</button>\n</div>\n\n<script>\n  let semuaAcara = [];\n\n  function tampilkan(daftar) {\n    const wadah = document.getElementById("jadwal");\n    wadah.innerHTML = "";\n    daftar.forEach(function (a) {\n      wadah.innerHTML += `<div class="acara"><h3>${a.musisi}</h3><p>${a.genre}, ${a.jam}</p></div>`;\n    });\n  }\n\n  document.querySelectorAll(".filter button").forEach(function (tombol) {\n    tombol.addEventListener("click", function () {\n      const genre = tombol.dataset.genre;\n      if (genre === "Semua") {\n        tampilkan(semuaAcara);\n      } else {\n        tampilkan(semuaAcara.filter(a => a.genre === genre));\n      }\n    });\n  });\n\n  // inside the try in muatJadwal():\n  //   semuaAcara = await respon.json();\n  //   tampilkan(semuaAcara);\n<\/script>']
    },
    sukses: ['My jazz regular burst out laughing and said, "finally, a website that gets me" 😆', 'Payment\'s been sent.']
  },
  {
    judul: 'Search for a musician',
    pesan: [
      'Last one, and this is a request from my fussiest customer 😄',
      'A search box for musician names. Every time you type a letter, the list filters instantly. Upper or lower case doesn\'t matter: "rara" and "RARA" give the same result.',
      'If nothing matches, show "No matching events." And if the box is cleared, all the events come back.'
    ],
    reqs: [
      { label: 'Search box (input type="search")', ask: 'the search box isn\'t there yet' },
      { label: 'Type "RARA": only Rara\'s event shows', ask: 'I typed RARA and it\'s not just Rara\'s event showing' },
      { label: 'Nothing matches: "No matching events" appears', ask: 'when nothing matches, the page is just empty with no message' },
      { label: 'Box cleared: all events come back', ask: 'after I cleared the box, not all the events came back' }
    ],
    catatan: {
      teks: 'The <code>input</code> event runs every time the box\'s content changes, so results can be filtered as you type. To make upper and lower case not matter, convert both sides with <code>toLowerCase()</code> before comparing. <code>includes()</code> checks whether one piece of text contains another, and an empty string always matches, so an empty box automatically shows everything. Add a <code>daftar.length === 0</code> check in <code>tampilkan()</code> for the "no matches" message.',
      contoh: 'const kolom = document.getElementById("cari-buku");\nkolom.addEventListener("input", function () {\n  const kata = kolom.value.toLowerCase();\n  const hasil = buku.filter(b => b.judul.toLowerCase().includes(kata));\n  tampilkan(hasil);\n});',
      petunjuk: ['Add <input type="search" id="cari">, attach an input event that calls tampilkan() with the filtered result, then handle the empty list in tampilkan().', '<input type="search" id="cari" placeholder="Search musicians...">\n\nconst kolomCari = document.getElementById("cari");\nkolomCari.addEventListener("input", function () {\n  const kata = kolomCari.value.toLowerCase();\n  const hasil = semuaAcara.filter(a => a.musisi.toLowerCase().includes(kata));\n  tampilkan(hasil);\n});\n\n// at the start of tampilkan(daftar), after wadah.innerHTML = "":\nif (daftar.length === 0) {\n  wadah.textContent = "No matching events.";\n  return;\n}']
    },
    sukses: ['My fussy customer already tried it. He said, "Now that\'s more like it." Coming from him, that\'s the highest praise there is 😂', 'Thank you so much, {nama}. Ruang Nada now has a website that really feels alive. Drop by sometime, the coffee and the music are on the house.']
  }
  ]
};

/* CodeQuest: English text for Bab 4 (Pak Dedi, Laundry Kilat) */
CQ_BAB_EN[3] = {
  klien: {
    nama: 'Pak Dedi', usaha: 'Laundry Kilat',
    kirimTeks: 'Updated it, Pak Dedi. Please give it a try 🙏',
    revisiBuka: 'I tried it, Mas. But ', revisiDaftar: 'a few things still aren\'t quite right:', revisiTutup: 'Take your time, my washing machine\'s still spinning too 🧺'
  },
  unlock: ['Laundry Kilat regular client', 'Receipt template'],
  hadiah: { teks: 'Pak Dedi pinned a receipt saying "PAID IN FULL, lifetime subscription" on your studio corkboard.' },
  penutup: {
    judul: 'Fourth project done',
    teks: 'Laundry Kilat now has a receipt calculator that handles half kilos, weird weights, the regulars\' discount, and the pickup & delivery fee. This is the first time your code has counted someone else\'s money.'
  },
  pembuka: 'New project: Laundry Kilat. From now on, clients see your reputation stars before deciding what to pay.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Laundry Kilat Pak Dedi</title>
  <style>
    body {
      background-color: #EEF4F8;
      color: #1F2A36;
      font-family: system-ui, sans-serif;
      max-width: 480px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>Laundry Kilat</h1>
  <p>Wash, dry, iron. Done in a day.</p>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Receipt form',
    pesan: [
      'Mas {nama}, I\'m Dedi, I own Laundry Kilat across from the boarding houses. Mas Bima gave me your number.',
      'Up to now I\'ve been writing the kilos down in an exercise book. The book got splashed with fabric softener and all the numbers have smudged 😩',
      'I want a page so I can do the sums myself. It needs a box for the laundry weight (kg), a choice of Regular service (Rp7.000/kg) or Express (Rp12.000/kg), a CALCULATE button, and a spot to show the total. Give it the id "total-harga", okay, my nephew says that\'s important.'
    ],
    reqs: [
      { label: 'Laundry weight box (input type="number")', ask: 'there\'s no box to write the weight in yet' },
      { label: 'Regular and Express choice (radios in one group)', ask: 'the Regular and Express choice isn\'t there yet, or you can pick both at once' },
      { label: 'Calculate button', ask: 'the CALCULATE button isn\'t there yet' },
      { label: 'Result spot with id="total-harga"', ask: 'the spot for the total isn\'t there yet' }
    ],
    catatan: {
      teks: 'A number field uses <code>&lt;input type="number"&gt;</code>, so phones show a number keyboard right away. A choice where only one option is allowed uses <code>&lt;input type="radio"&gt;</code>. All the radios in one choice must have the same <code>name</code>, so picking one automatically unpicks the others. Store the price per kilo in the <code>value</code> attribute, and give every radio a label.',
      contoh: '<label for="jumlah">Number of portions</label>\n<input type="number" id="jumlah">\n\n<label><input type="radio" name="ukuran" value="10000" checked> Small</label>\n<label><input type="radio" name="ukuran" value="15000"> Large</label>',
      petunjuk: ['Make one number input, two radios with name="layanan", one button, and one <p id="total-harga">.', '<label for="kilo">Laundry weight (kg)</label>\n<input type="number" id="kilo">\n\n<label><input type="radio" name="layanan" value="7000" checked> Regular (Rp7.000/kg)</label>\n<label><input type="radio" name="layanan" value="12000"> Express (Rp12.000/kg)</label>\n\n<button>Calculate</button>\n<p id="total-harga"></p>']
    },
    sukses: ['Wow, it already looks like a real cash register. My customers will think this is some expensive app 😄', 'Here\'s the down payment first, Mas.']
  },
  {
    judul: 'A button that calculates',
    pesan: [
      'The button\'s there, but when you press it nothing happens yet, hehe.',
      'Try making a function hitungTotal() ("hitung total" means calculate total), then have the button call it with onclick. My nephew says that way is the easiest to read.',
      'The rule: weight times the service price. 3 kg Regular comes to 21.000, 2 kg Express comes to 24.000.'
    ],
    reqs: [
      { label: 'A hitungTotal() function exists', ask: 'the hitungTotal() function isn\'t there yet' },
      { label: 'CALCULATE button calls hitungTotal() via onclick', ask: 'the button isn\'t calling hitungTotal() with onclick yet' },
      { label: '3 kg Regular gives 21.000', ask: 'I tried 3 kg Regular and the result isn\'t 21.000' },
      { label: '2 kg Express gives 24.000', ask: 'I tried 2 kg Express and the result isn\'t 24.000' }
    ],
    catatan: {
      teks: 'The <code>onclick</code> attribute runs JavaScript code when the element is clicked, for example <code>onclick="hitungTotal()"</code>. Inside the function, you read a field\'s content with <code>.value</code>. The result is always text, so turn it into a number first with <code>Number()</code>. The radio that\'s currently selected can be grabbed with <code>document.querySelector(\'input[name="layanan"]:checked\')</code>. Show the result with <code>innerText</code>.',
      contoh: '<button onclick="hitungOngkir()">Calculate</button>\n\n<script>\n  function hitungOngkir() {\n    const jarak = Number(document.getElementById("jarak").value);\n    document.getElementById("ongkir").innerText = jarak * 2500;\n  }\n<\/script>',
      petunjuk: ['Give the button onclick="hitungTotal()". Inside the function: get the weight, get the value of the :checked radio, multiply them, then write the result to #total-harga.', '<button onclick="hitungTotal()">Calculate</button>\n\n<script>\n  function hitungTotal() {\n    const kilo = Number(document.getElementById("kilo").value);\n    const harga = Number(document.querySelector(\'input[name="layanan"]:checked\').value);\n    document.getElementById("total-harga").innerText = kilo * harga;\n  }\n<\/script>']
    },
    sukses: ['I tested it with the laundry from the kid in room 4 at the boarding house, and it matched my own calculator. Great.', 'Transferring now, Mas.']
  },
  {
    judul: 'Rupiah format',
    pesan: [
      'The result is right now, but it just says "102000". Customers get confused: is that a hundred and two thousand, or ten thousand two hundred?',
      'Please show it like on a real receipt: "Rp102.000", with dots separating the thousands.',
      'For example, one of the boarding house kids had 8.5 kg of Express laundry. That has to show as Rp102.000.'
    ],
    reqs: [
      { label: 'Total starts with "Rp"', ask: 'the total doesn\'t have the Rp in front yet' },
      { label: '8.5 kg Express shows "Rp102.000"', ask: 'I tried 8.5 kg Express and it doesn\'t say Rp102.000 yet' },
      { label: 'Uses toLocaleString or Intl.NumberFormat', ask: 'my nephew says the format isn\'t using toLocaleString yet' }
    ],
    catatan: {
      teks: 'You can format numbers the Indonesian way with <code>angka.toLocaleString("id-ID")</code>: 102000 becomes "102.000". Then just add "Rp" in front. A more complete alternative is <code>Intl.NumberFormat</code>. Watch the decimal separator too: Indonesians write 8,5 kg with a comma, but in a number field you type it as 8.5.',
      contoh: 'const harga = 2500000;\nconsole.log("Rp" + harga.toLocaleString("id-ID"));\n// Rp2.500.000',
      petunjuk: ['Store the multiplication result in a variable called total, then write "Rp" + total.toLocaleString("id-ID").', 'const total = kilo * harga;\ndocument.getElementById("total-harga").innerText = "Rp" + total.toLocaleString("id-ID");']
    },
    sukses: ['Now that\'s a proper receipt. The boarding house kids can\'t pretend they misread it anymore 😂', 'Here\'s your payment.']
  },
  {
    judul: 'Half kilos and weird numbers',
    pesan: [
      'Mas, sorry for the midnight WhatsApp 🙏 Someone just asked: what about 0.5 kg?',
      'Here\'s my rule: my scale goes by half kilos, so 2.5 kg is fine. But the minimum charge is 1 kg. So 0.5 kg still counts as 1 kg.',
      'And earlier some cheeky boarding house kid typed -3 kg, and the result went negative 😅 If the weight is empty, zero, or negative, just show "Enter a valid weight".'
    ],
    reqs: [
      { label: 'Weight box accepts half kilos (step="0.5")', ask: 'the box can\'t take half kilos yet' },
      { label: '0.5 kg Regular charged at the 1 kg minimum: Rp7.000', ask: '0.5 kg Regular should be charged as 1 kg, so Rp7.000' },
      { label: '2.5 kg Regular: Rp17.500', ask: '2.5 kg Regular should be Rp17.500' },
      { label: 'Negative weight: "Enter a valid weight" appears', ask: 'when I typed -3, "Enter a valid weight" didn\'t show up' },
      { label: 'Empty or zero box: the same message appears', ask: 'when the box is empty or zero, the message doesn\'t show up yet' }
    ],
    catatan: {
      teks: 'Users can type anything, so good code checks first before calculating. Use <code>if</code> to catch cases that don\'t make sense. An empty field becomes <code>0</code> after <code>Number()</code>, so it\'s enough to check whether the weight is more than zero. <code>return</code> stops the function early. After that, apply the business rule: <code>Math.max(kilo, 1)</code> picks the larger value, so a weight under 1 kg still counts as 1 kg. The <code>step="0.5"</code> attribute makes the field accept multiples of a half.',
      contoh: 'function hitungTiket(umur) {\n  if (!(umur > 0)) {\n    hasil.innerText = "Invalid age";\n    return;\n  }\n  const dihitung = Math.max(umur, 5);\n  // ...\n}',
      petunjuk: ['At the start of hitungTotal(): if the weight isn\'t more than 0, show the message and return. After that, use Math.max(kilo, 1).', '<input type="number" id="kilo" min="0" step="0.5">\n\nfunction hitungTotal() {\n  const kilo = Number(document.getElementById("kilo").value);\n  const hasil = document.getElementById("total-harga");\n  if (!(kilo > 0)) {\n    hasil.innerText = "Enter a valid weight";\n    return;\n  }\n  const harga = Number(document.querySelector(\'input[name="layanan"]:checked\').value);\n  const total = Math.max(kilo, 1) * harga;\n  hasil.innerText = "Rp" + total.toLocaleString("id-ID");\n}']
    },
    sukses: ['I just tried typing -3 and it told me off right away. Cheeky boarding house kid: totally defeated 😆', 'Thanks for letting me wake you up at midnight, Mas. Here\'s your payment.']
  },
  {
    judul: 'Pickup & delivery and regulars',
    pesan: [
      'Good news: I\'ve got a motorbike now for picking up and delivering laundry! The fee is Rp5.000 per trip.',
      'One more thing. Customers with 10 kg of laundry or more get a 10% regulars\' discount. But the discount is only on the laundry price, the pickup & delivery fee isn\'t discounted.',
      'Add a "Pickup & delivery" checkbox, okay. Examples to check with: 3 kg Express with pickup & delivery comes to Rp41.000. 10 kg Regular comes to Rp63.000, and with pickup & delivery it\'s Rp68.000.'
    ],
    reqs: [
      { label: 'Pickup & delivery checkbox', ask: 'the Pickup & delivery checkbox isn\'t there yet' },
      { label: '3 kg Express + pickup & delivery: Rp41.000', ask: '3 kg Express with pickup & delivery should be Rp41.000' },
      { label: '10 kg Regular gets 10% off: Rp63.000', ask: '10 kg Regular should get the discount, so Rp63.000' },
      { label: '10 kg Regular + pickup & delivery: Rp68.000', ask: '10 kg Regular with pickup & delivery should be Rp68.000, and the fee shouldn\'t get discounted too' },
      { label: '3 kg Regular without pickup & delivery stays Rp21.000', ask: 'the normal calculation that used to be right has changed now' }
    ],
    catatan: {
      teks: 'A checkbox uses <code>&lt;input type="checkbox"&gt;</code>, and its state is read with <code>.checked</code> (true or false). The order of the calculation matters: work out the laundry price, apply the discount if it qualifies, and only then add the fee. A 10% discount means multiplying the price by <code>0.9</code>. The ternary operator <code>condition ? a : b</code> is handy for a value that depends on one condition. Round the final result with <code>Math.round</code>, because decimal multiplication on a computer sometimes produces numbers like 62999.99999.',
      contoh: 'let subtotal = porsi * 20000;\nif (porsi >= 5) {\n  subtotal = subtotal * 0.95;\n}\nconst ongkir = pakaiKurir.checked ? 8000 : 0;\nconst total = Math.round(subtotal + ongkir);',
      petunjuk: ['Add <input type="checkbox" id="antar"> with a label. In the function: calculate the laundry price, multiply it by 0.9 if kilo >= 10, then add 5000 if the box is checked.', '<label><input type="checkbox" id="antar"> Pickup & delivery (Rp5.000)</label>\n\nlet cucian = Math.max(kilo, 1) * harga;\nif (kilo >= 10) {\n  cucian = cucian * 0.9;\n}\nconst ongkos = document.getElementById("antar").checked ? 5000 : 0;\nconst total = Math.round(cucian + ongkos);']
    },
    sukses: ['Just now a customer brought 12 kg, got the discount, and gave me a big grin. I grinned too, because now he\'s a regular for good 😄', 'Payment\'s in, Mas.']
  },
  {
    judul: 'A receipt-style slip',
    pesan: [
      'Last thing, the look. I want it to look like a real laundry receipt.',
      'Wrap everything in the class "nota" ("nota" means receipt): dashed edges, typewriter letters like a shop receipt. No wider than 420px, like receipt paper.',
      'I\'m sending a shirt icon to put at the top of the receipt. Don\'t forget the image description.'
    ],
    reqs: [
      { label: 'Form and total wrapped in class="nota"', ask: 'the receipt isn\'t wrapped in the "nota" class yet' },
      { label: 'Dashed edges (border dashed)', ask: 'the receipt edges aren\'t dashed yet' },
      { label: 'Monospace receipt-style font', ask: 'the letters don\'t look like receipt letters yet' },
      { label: 'Receipt at most 420px wide', ask: 'the receipt is still too wide' },
      { label: 'Shirt icon (ikon-baju.svg) shown with alt', ask: 'the shirt icon isn\'t showing, or it doesn\'t have a description yet' }
    ],
    catatan: {
      teks: 'The receipt is a CSS job again. <code>border: 2px dashed</code> makes a dashed line, and <code>font-family: "Courier New", monospace</code> gives letters that are all the same width, like a cash register. Limit the width with <code>max-width</code>. If the receipt is wrapped in one <code>&lt;div class="nota"&gt;</code>, all the styles can go in a single rule.',
      contoh: '.tiket {\n  border: 2px dashed #555;\n  font-family: "Courier New", monospace;\n  max-width: 360px;\n  padding: 16px;\n}',
      petunjuk: ['Wrap the form and the result in <div class="nota">, put <img src="ikon-baju.svg" alt="..."> above them, then add a .nota rule.', '<div class="nota">\n  <img src="ikon-baju.svg" alt="Laundry Kilat T-shirt icon" width="64">\n  <!-- form and #total-harga go here -->\n</div>\n\n.nota {\n  border: 2px dashed #6B7A89;\n  font-family: "Courier New", monospace;\n  max-width: 380px;\n  padding: 16px;\n  background: white;\n}']
    },
    sukses: ['My nephew says this is "aesthetic". I don\'t know what that means, but it sounds good 😄', 'Thank you so much, Mas {nama}. Starting next month, your laundry gets the regulars\' price from me, for life.']
  }
  ]
};

/* CodeQuest: English text for Bab 5 (Kak Riko) */
CQ_BAB_EN[4] = {
  klien: {
    nama: 'Kak Riko', usaha: 'Karang Taruna RT 05',
    kirimTeks: 'Updated it, Kak Riko. Take a look 🙏',
    revisiBuka: 'Checked it with the crew. But ', revisiDaftar: 'a few things are still missing:', revisiTutup: 'Keep going, 17-an is still a week away! 🇮🇩'
  },
  unlock: ['Table template', '17-an stickers'],
  hadiah: { teks: 'Kak Riko sent a Gebyar 17-an sticker. It\'s stuck on your corkboard now. The RT moms are officially your fans.' },
  penutup: {
    judul: 'Fifth project done',
    teks: 'The RT 05 17-an portal now has a table read from data, sideways scrolling on phones, a video that isn\'t squashed, a surprise prize column, and a countdown that counts by itself.'
  },
  pembuka: 'New project: Gebyar 17-an RT 05. In the game world, today is August 10, 2026.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gebyar 17-an RT 05</title>
  <style>
    body {
      background-color: #FFF8F0;
      color: #2B2B2B;
      font-family: system-ui, sans-serif;
      max-width: 820px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #C62828;
    }
  </style>
</head>
<body>
  <header>
    <h1>Gebyar 17-an RT 05</h1>
    <p>Merdeka! Come join the neighborhood games.</p>
  </header>

  <section id="jadwal">
    <h2>Event Schedule</h2>
  </section>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Table skeleton',
    pesan: [
      'Hi {nama}! I\'m Riko, head of the Karang Taruna (youth group) of RT 05. This year\'s 17-an has to be a blast, but the website can\'t blow up 😂',
      'I need the competition schedule as a table. The very top row is a big title "GEBYAR 17-AN RT 05 SCHEDULE" stretching across all the columns. Under it, the columns: Day, Time, Event, Location.',
      'I\'m sending the RT logo too, put it at the top, okay?'
    ],
    reqs: [
      { label: 'RT 05 logo (logo-rt05.svg) shows with alt', ask: 'the RT logo isn\'t showing yet, or it has no description' },
      { label: 'Table has <thead> and <tbody>', ask: 'the table isn\'t split into a head part and a body part yet' },
      { label: 'Day, Time, Event, Location columns', ask: 'the Day, Time, Event and Location columns aren\'t all there yet' },
      { label: 'Title "GEBYAR 17-AN RT 05 SCHEDULE" spans with colspan', ask: 'the big title doesn\'t stretch across all the columns yet' }
    ],
    catatan: {
      teks: 'Tables are for data that has rows and columns. <code>&lt;thead&gt;</code> holds the header rows, <code>&lt;tbody&gt;</code> holds the data. Each row is a <code>&lt;tr&gt;</code>, a header cell is a <code>&lt;th&gt;</code>, and a data cell is a <code>&lt;td&gt;</code>. The <code>colspan</code> attribute makes one cell stretch across several columns, which is perfect for a table title. Its value must equal the number of columns.',
      contoh: '<table>\n  <thead>\n    <tr><th colspan="3">CLEANING ROSTER</th></tr>\n    <tr><th>Day</th><th>Name</th><th>Task</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Monday</td><td>Andi</td><td>Sweep</td></tr>\n  </tbody>\n</table>',
      petunjuk: ['Two rows in <thead>: one <th colspan="4"> for the title, and one row with four <th>. <tbody> can stay empty for now.', '<img src="logo-rt05.svg" alt="RT 05 logo" width="72">\n\n<table>\n  <thead>\n    <tr><th colspan="4">GEBYAR 17-AN RT 05 SCHEDULE</th></tr>\n    <tr><th>Day</th><th>Time</th><th>Event</th><th>Location</th></tr>\n  </thead>\n  <tbody id="isi-jadwal"></tbody>\n</table>']
    },
    sukses: ['Awesome, the title stretches out proudly like the banner on the neighborhood gate 😎', 'Here\'s the down payment from the Karang Taruna fund.']
  },
  {
    judul: 'Fill the table from data',
    pesan: [
      'I\'m sending the data in a file called lomba.json. It has six events in it.',
      'The schedule can still shift around depending on Pak RT, so don\'t type the table rows by hand. Load them from the file, then build the rows with JavaScript.',
      'Each row has the day, time, event name and location, matching the columns.'
    ],
    reqs: [
      { label: 'Data loaded from lomba.json with fetch', ask: 'the schedule isn\'t being read from the lomba.json file yet' },
      { label: 'Six event rows in <tbody>', ask: 'there aren\'t six event rows showing yet' },
      { label: 'Rows built by JavaScript, not typed by hand', ask: 'some rows are still typed by hand in the HTML' },
      { label: 'Each row has as many cells as there are columns', ask: 'some rows have too few or too many cells, so the columns are a mess' },
      { label: 'Balap Karung is in the table', ask: 'the Balap Karung (sack race) event isn\'t in the table yet' }
    ],
    catatan: {
      teks: 'You already used <code>fetch</code> and <code>forEach</code> at Ruang Nada. The difference is that now you\'re building table rows. A tidy way to do it: create a row with <code>document.createElement("tr")</code>, fill it using <code>innerHTML</code> with a few <code>&lt;td&gt;</code>, then attach it to the <code>&lt;tbody&gt;</code> with <code>appendChild</code>. Click <code>lomba.json</code> above the editor to see the field names in the data.',
      contoh: 'const baris = document.createElement("tr");\nbaris.innerHTML = `<td>${s.nama}</td><td>${s.kelas}</td>`;\ndocument.getElementById("isi-tabel").appendChild(baris);',
      petunjuk: ['Give <tbody> an id, write an async function that loads lomba.json, then for each event create a <tr> with four <td>.', '<script>\n  async function muatLomba() {\n    const respon = await fetch("lomba.json");\n    const daftar = await respon.json();\n    const isi = document.getElementById("isi-jadwal");\n    daftar.forEach(function (l) {\n      const baris = document.createElement("tr");\n      baris.innerHTML = `<td>${l.hari}</td><td>${l.jam}</td><td>${l.lomba}</td><td>${l.lokasi}</td>`;\n      isi.appendChild(baris);\n    });\n  }\n  muatLomba();\n<\/script>']
    },
    sukses: ['Pak RT just moved the marbles race to Sunday. I only changed the file and the table followed right away. No all-nighter needed ✨', 'Sending the transfer, Kak.']
  },
  {
    judul: 'Easy to read on a phone',
    pesan: [
      'The RT moms open the website on their phones, and the table gets cut off on the right 😅',
      'Make the table scroll sideways on small screens, without making the whole page wobble. On a laptop, the table should be as wide as its container.',
      'And so nobody gets dizzy: alternate the row colors, and keep the table header stuck at the top while scrolling.'
    ],
    reqs: [
      { label: 'Table wrapped in a scrollable element (overflow-x: auto)', ask: 'the table can\'t scroll on its own yet, the whole page wobbles' },
      { label: 'Table fills its container (width: 100%)', ask: 'on a laptop the table is still small in the middle' },
      { label: 'Alternating row colors (:nth-child)', ask: 'the rows don\'t alternate colors yet' },
      { label: 'Table header sticks while scrolling (position: sticky)', ask: 'the table header still disappears when scrolling' }
    ],
    catatan: {
      teks: 'A wide table is best wrapped in a <code>&lt;div&gt;</code> with <code>overflow-x: auto</code>: only the table scrolls, and the page stays still. The selector <code>tbody tr:nth-child(even)</code> picks the even rows, perfect for alternating colors. <code>position: sticky</code> with <code>top: 0</code> makes the header cells stick to the top while their container scrolls. Give the header cells a background color, so the content underneath doesn\'t show through.',
      contoh: '.wadah-tabel {\n  overflow-x: auto;\n}\ntbody tr:nth-child(even) {\n  background-color: #F5F5F5;\n}\nth {\n  position: sticky;\n  top: 0;\n  background-color: white;\n}',
      petunjuk: ['Wrap the <table> in a <div class="wadah-tabel">, then add rules for overflow-x, width 100%, nth-child, and sticky.', '<div class="wadah-tabel">\n  <table>...</table>\n</div>\n\n.wadah-tabel {\n  overflow-x: auto;\n  max-height: 420px;\n}\ntable {\n  width: 100%;\n  border-collapse: collapse;\n}\ntbody tr:nth-child(even) {\n  background-color: #FDECEC;\n}\nth {\n  position: sticky;\n  top: 0;\n  background-color: #C62828;\n  color: white;\n}']
    },
    sukses: ['Bu RT immediately sent a thumbs-up sticker to the group. From her, that\'s basically a trophy 🏆', 'Here\'s your pay, Kak.']
  },
  {
    judul: 'Last year\'s competition video',
    pesan: [
      'To liven things up, I want to put up last year\'s sack race video. Here\'s the link: https://youtu.be/bKarung2025?si=RT05grup',
      'But my friend says you can\'t just paste a link like that. It has to be turned into an "embed" link first.',
      'And don\'t let the video get squashed, okay? Last year on the village office website, it looked like a slice of bread that got run over 😂'
    ],
    reqs: [
      { label: 'Video embedded with a YouTube embed <iframe>', ask: 'the video isn\'t embedded with an iframe embed yet' },
      { label: 'Correct video ID, without "?si=..."', ask: 'the video ID isn\'t right yet, or the ?si= part is still there' },
      { label: '16:9 ratio, not squashed', ask: 'the video is still squashed' },
      { label: 'iframe has a title for screen readers', ask: 'the iframe doesn\'t have a title yet' }
    ],
    catatan: {
      teks: 'A YouTube video is embedded with an <code>&lt;iframe&gt;</code>, but the address has to look like <code>https://www.youtube.com/embed/VIDEO_ID</code>. The video ID is the part after <code>youtu.be/</code>, before the question mark. The <code>?si=...</code> part only marks who shared the link, so just drop it. To keep it from getting squashed, give it <code>width: 100%</code> and <code>aspect-ratio: 16 / 9</code>, and don\'t set a height attribute. The <code>title</code> attribute describes what\'s in the iframe to screen readers. Inside the game, the video is replaced by a stand-in display so it still works without internet.',
      contoh: '<!-- share link: https://youtu.be/abcDEF12345?si=xyz -->\n<iframe\n  src="https://www.youtube.com/embed/abcDEF12345"\n  title="School profile video"\n  allowfullscreen></iframe>\n\niframe {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  border: 0;\n}',
      petunjuk: ['The video ID is bKarung2025. Write an iframe with the embed src and a title, then CSS with width 100% and aspect-ratio.', '<section id="video">\n  <h2>Balap Karung 2025</h2>\n  <iframe src="https://www.youtube.com/embed/bKarung2025" title="RT 05 sack race video, 2025" allowfullscreen></iframe>\n</section>\n\niframe {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  border: 0;\n  border-radius: 12px;\n}']
    },
    sukses: ['Not squashed! You can see Pak RT falling over in his sack really clearly. He even asked us never to delete the video 😂', 'Here\'s your pay.']
  },
  {
    judul: 'Surprise prize column',
    pesan: [
      'Kak... Pak RT just called 😅',
      '"Add a Prize column! The prize for the greased pole climb is a 2-door fridge!" He says it\'ll get everyone fired up.',
      'I\'ve already added the prize data to lomba.json. Please change the table without breaking what\'s already there: a new column in the header, the big title stretching along with it, and a prize cell in every row.'
    ],
    reqs: [
      { label: 'Prize column in the table header', ask: 'there\'s no Prize column in the table header yet' },
      { label: 'Title spans all columns (colspan="5")', ask: 'the big title doesn\'t stretch over the Prize column yet' },
      { label: 'Every row has a Prize cell', ask: 'the rows don\'t have a prize cell yet' },
      { label: 'Panjat Pinang prize is Kulkas 2 pintu (2-door fridge)', ask: 'the 2-door fridge (kulkas 2 pintu) prize for Panjat Pinang isn\'t showing yet' }
    ],
    catatan: {
      teks: 'Last-minute requests are part of the job. Because the rows are built from data, the change only takes three spots: one new <code>&lt;th&gt;</code> in the header, the title\'s <code>colspan</code> raised from 4 to 5, and one new <code>&lt;td&gt;</code> in the row template. Take another look at <code>lomba.json</code>, because it now has a <code>hadiah</code> (prize) field.',
      contoh: '<tr><th colspan="3">SCORES</th></tr>\n<tr><th>Name</th><th>Task</th><th>Score</th></tr>\n\n// row template:\n`<td>${s.nama}</td><td>${s.tugas}</td><td>${s.nilai}</td>`',
      petunjuk: ['Change colspan="4" to "5", add <th>Prize</th>, and add <td>${l.hadiah}</td> to the row template.', '<tr><th colspan="5">GEBYAR 17-AN RT 05 SCHEDULE</th></tr>\n<tr><th>Day</th><th>Time</th><th>Event</th><th>Location</th><th>Prize</th></tr>\n\nbaris.innerHTML = `<td>${l.hari}</td><td>${l.jam}</td><td>${l.lomba}</td><td>${l.lokasi}</td><td>${l.hadiah}</td>`;']
    },
    sukses: ['Pak RT looked at the prize column and said, "The fridge looks big on the website, huh." Yes, Pak, that\'s because the table is tidy 😂', 'There\'s a bonus from the fund for the rush job.']
  },
  {
    judul: 'Countdown and winners',
    pesan: [
      'Last one! Two things.',
      'First, a countdown to August 17 in the element with id "hitung-mundur" ("countdown"). The text: "Only 7 days to go!" But don\'t type it by hand, it has to be calculated from today\'s date, so tomorrow it automatically becomes 6 days.',
      'Second, a winners announcement section with id "juara" ("champion"). Fill it in by hand for now with last year\'s winners: Balap Karung (sack race), Dimas. Makan Kerupuk (cracker eating), Bu Wati. Tarik Tambang (tug of war), Tim Gang Mawar.'
    ],
    reqs: [
      { label: 'The #juara section lists at least 3 winners (<li> list)', ask: 'the winners announcement isn\'t there yet, or it has fewer than three' },
      { label: '#hitung-mundur shows "7 days"', ask: 'the countdown doesn\'t show 7 days yet' },
      { label: 'Calculated with Date, not typed by hand', ask: 'the number of days is still typed by hand' }
    ],
    catatan: {
      teks: '<code>new Date()</code> gives you the current date and time. <code>new Date(2026, 7, 17)</code> creates the date August 17, 2026. Careful: months are counted from 0, so August is 7. You can subtract two dates, and the result is in milliseconds. Divide by <code>1000 * 60 * 60 * 24</code> to get days, then round up with <code>Math.ceil</code>. In the game world, today is August 10, 2026 at 09:00.',
      contoh: 'const sekarang = new Date();\nconst ulangTahun = new Date(2026, 11, 25);\nconst selisih = ulangTahun - sekarang;\nconst hari = Math.ceil(selisih / (1000 * 60 * 60 * 24));',
      petunjuk: ['Make a <p id="hitung-mundur"></p>, then in the script calculate the days left until new Date(2026, 7, 17). For the winners, a <section id="juara"> with an <ol> inside is enough.', '<p id="hitung-mundur"></p>\n\n<section id="juara">\n  <h2>Last Year\'s Winners</h2>\n  <ol>\n    <li>Balap Karung: Dimas</li>\n    <li>Makan Kerupuk: Bu Wati</li>\n    <li>Tarik Tambang: Tim Gang Mawar</li>\n  </ol>\n</section>\n\n<script>\n  const hariH = new Date(2026, 7, 17);\n  const sisa = Math.ceil((hariH - new Date()) / (1000 * 60 * 60 * 24));\n  document.getElementById("hitung-mundur").textContent = `Only ${sisa} days to go!`;\n<\/script>']
    },
    sukses: ['The RT kids wait for the countdown every morning like they wait for the maghrib call to prayer during fasting month 😆', 'The whole RT is proud, Kak {nama}. The moms want you to judge the cooking contest next year.']
  }
  ]
};

/* CodeQuest: English text for Bab 6 (Mas Alif) */
CQ_BAB_EN[5] = {
  klien: {
    nama: 'Mas Alif', usaha: 'Kopi Alif',
    kirimTeks: 'I\'ve fixed it, Mas Alif. Give it a try.',
    revisiBuka: 'Sorry to bother you, Mas. But ', revisiDaftar: 'some things are still weird:', revisiTutup: 'I\'ll wait. I\'m learning too, honestly 🙇'
  },
  unlock: ['Skill: Debugging Lv 1', 'Secret console', 'Cockroach easter egg'],
  penutup: {
    judul: 'Sixth project done',
    teks: 'Kopi Alif now has a clean console, data saved as JSON, its own storage key, and a Check authenticity tool. The pay was zero rupiah. But you\'re going home with debugging skills, and a file that shouldn\'t exist yet.'
  },
  pembuka: 'Bu Sari sent a message: "Mas, how come there\'s a new coffee shop whose website looks just like mine? And the orders on my website have gone weird too."',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kopi Alif</title>
  <style>
    body {
      background-color: #F6E7D0;
      color: #3B2A20;
      font-family: Georgia, serif;
      max-width: 640px;
      margin: 0 auto;
      padding: 16px;
    }
    h1 {
      color: #B5562B;
    }
    .menu-item {
      display: block;
      margin: 6px 0;
    }
  </style>
</head>
<body>
  <!-- Copied from Warung Kopi Senja. Don't tell anyone. -->
  <h1>Kopi Alif</h1>
  <p>Open every day, 07.00 - 22.00</p>

  <h2>Menu</h2>
  <div id="menu"></div>

  <h2>Your order</h2>
  <ul id="daftar-pesan"></ul>

  <script>
    const KUNCI = "warungkopi_v1";
    const MENU = [
      { nama: "Kopi Tubruk", harga: 8000 },
      { nama: "Es Kopi Susu", harga: 15000 },
      { nama: "Teh Tarik", harga: 10000 },
      { nama: "Pisang Goreng", harga: 12000 }
    ];
    let keranjang = [];

    function tampilkanMenu() {
      const wadah = document.getElementById("menu");
      MENU.forEach(function (m) {
        wadah.innerHTML += \`<button class="menu-item" onclick="tambah('\${m.nama}')">+ \${m.nama}</button>\`;
      });
    }

    function tampilkanKeranjang() {
      const daftar = document.getElementById("daftar-pesanan");
      daftar.innerHTML = "";
      keranjang.forEach(function (nama) {
        daftar.innerHTML += \`<li>\${nama}</li>\`;
      });
    }

    function tambah(nama) {
      keranjang.push(nama);
      simpan();
      tampilkanKeranjang();
    }

    function simpan() {
      localStorage.setItem(KUNCI, keranjang);
    }

    function muat() {
      const data = localStorage.getItem(KUNCI);
      if (data) {
        keranjang = data;
      }
    }

    muat();
    tampilkanMenu();
    tampilkanKeranjang();
  </script>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Find the error in the console',
    pesan: [
      'Mas {nama}... I\'m Alif, I just opened a coffee shop near your boarding house. I want to be honest first: I copied my website from the Warung Kopi Senja site you made 🙇',
      'All I changed was the name. But now it\'s broken: the menu shows up, but the order list doesn\'t work. And weirdly, the orders on Bu Sari\'s website have gone haywire too.',
      'I can\'t pay you yet, Mas. But please help. People say errors show up in the console.'
    ],
    reqs: [
      { label: 'Console is clean when the page opens', ask: 'the console is still red when the page opens' },
      { label: 'Four menu buttons show', ask: 'there aren\'t all four menu buttons' },
      { label: 'Menu buttons add orders to the list', ask: 'I press a menu item, but the order list stays empty' }
    ],
    catatan: {
      teks: 'The console is where the browser reports problems. In the game, the console is below the editor. In a real browser, open DevTools with F12 (or right-click and choose Inspect), then pick the Console tab. Read the message slowly: <code>Cannot set properties of null</code> means the code tried to change an element that wasn\'t found. Usually that\'s because the id in the JavaScript is different from the id in the HTML, even if only by one letter.',
      contoh: '<ul id="daftar-belanja"></ul>\n\n// WRONG: the id doesn\'t match, so the result is null\ndocument.getElementById("daftar-belanjaan");\n\n// RIGHT\ndocument.getElementById("daftar-belanja");',
      petunjuk: ['Read the error in the console, find the function that calls getElementById, then make its id match the one in the HTML.', 'function tampilkanKeranjang() {\n  const daftar = document.getElementById("daftar-pesan");\n  // ...\n}']
    },
    sukses: ['The order list shows up! I actually clapped by myself in the shop 😅', 'I can\'t pay yet, Mas. But your coffee is free at my place, anytime.']
  },
  {
    judul: 'Save as JSON',
    pesan: [
      'Now there\'s something else weird. My orders do get saved, but when I peeked in DevTools, on the Application tab, all it says is "Kopi Tubruk,Teh Tarik". Not a list.',
      'The forum says localStorage can only store text. So the list has to be turned into JSON text first.'
    ],
    reqs: [
      { label: 'Orders saved as JSON (JSON.stringify)', ask: 'what\'s in storage is still plain text, not JSON' },
      { label: 'Console stays clean', ask: 'the console is red again' }
    ],
    catatan: {
      teks: '<code>localStorage</code> only stores text. If you give it an array, JavaScript quietly turns it into text like "a,b", and the structure is lost. <code>JSON.stringify(data)</code> turns an array or object into JSON text that can still be read back later. In a real browser, you can see what\'s stored in DevTools, on the Application tab, under Local Storage.',
      contoh: 'const belanja = ["sugar", "coffee"];\nlocalStorage.setItem("belanja", JSON.stringify(belanja));\n// stored: ["sugar","coffee"]',
      petunjuk: ['In the simpan() function ("simpan" means save), wrap keranjang in JSON.stringify.', 'function simpan() {\n  localStorage.setItem(KUNCI, JSON.stringify(keranjang));\n}']
    },
    sukses: ['Now it looks neat, square brackets and everything. It feels like looking at a drawer that just got tidied up.', 'Still free, Mas. Sorry 🙇']
  },
  {
    judul: 'Read it back on load',
    pesan: [
      'The orders are saved neatly now. But when I reload the page, there\'s a red error again 😭',
      'I think when it\'s read back, it\'s still text, it hasn\'t turned back into a list.'
    ],
    reqs: [
      { label: 'Orders saved as JSON', ask: 'the orders aren\'t saved as JSON yet' },
      { label: 'After reopening: saved orders show again', ask: 'I reloaded, and the orders vanished from the list' },
      { label: 'After reopening: console is clean', ask: 'I reloaded, and the console turned red' }
    ],
    catatan: {
      teks: 'The opposite of <code>JSON.stringify</code> is <code>JSON.parse</code>: it turns JSON text back into an array or object. When the page opens, <code>getItem</code> returns text, or <code>null</code> if nothing is there yet. So only parse when the data exists. The checker will add two orders, then reopen the page.',
      contoh: 'const teks = localStorage.getItem("belanja");\nif (teks) {\n  belanja = JSON.parse(teks);\n}',
      petunjuk: ['In the muat() function ("muat" means load), change keranjang = data to keranjang = JSON.parse(data).', 'function muat() {\n  const data = localStorage.getItem(KUNCI);\n  if (data) {\n    keranjang = JSON.parse(data);\n  }\n}']
    },
    sukses: ['I reloaded ten times, and the orders are still there. So loyal 😅', 'I\'m writing this down as a debt I owe you, Mas.']
  },
  {
    judul: 'Clashing keys',
    pesan: [
      'Mas, I just realized why Bu Sari\'s website got messed up too.',
      'My website and Bu Sari\'s are on the same free hosting. The forum says if they\'re on the same domain, they share one localStorage. And my key is still "warungkopi_v1", exactly the same as Bu Sari\'s 😱',
      'So my website reads Bu Sari\'s data, and sometimes overwrites it. Please change my key to "kopialif_v2", and don\'t touch Bu Sari\'s data at all.'
    ],
    reqs: [
      { label: 'Page opens without errors even with Bu Sari\'s data present', ask: 'when Bu Sari\'s data is there, my page errors right away' },
      { label: 'Orders saved under the "kopialif_v2" key', ask: 'the orders aren\'t saved under the kopialif_v2 key yet' },
      { label: 'Bu Sari\'s data in "warungkopi_v1" is unchanged', ask: 'Bu Sari\'s data is still getting changed' },
      { label: 'Old key no longer used in the code', ask: 'the warungkopi_v1 key is still in the code' }
    ],
    catatan: {
      teks: 'All pages from the same domain share one localStorage. If two websites use the same key name, their data overwrites each other. That\'s why a key should be unique and versioned, for example <code>appname_v2</code>. A version helps when the shape of the data changes: a new key means a clean start without breaking the old data. In the game world, Bu Sari\'s data is already in <code>warungkopi_v1</code> when the page opens.',
      contoh: '// clash: used by two apps\nconst KUNCI = "data";\n\n// safe: unique and versioned\nconst KUNCI = "kasirdedi_v2";',
      petunjuk: ['Just change the value of the KUNCI constant ("kunci" means key). Don\'t delete or overwrite warungkopi_v1.', 'const KUNCI = "kopialif_v2";']
    },
    sukses: ['Bu Sari just told me her orders are back to normal. I\'m embarrassed, but relieved 🙇', 'She sends her regards. She said, "Tell Mas {nama} not to be too hard on Alif."']
  },
  {
    judul: 'Check authenticity',
    pesan: [
      'Mas, I have an idea. So I don\'t just copy things again, make me a "Check authenticity" tool.',
      'Two text boxes: the first one for my code, the second one for someone else\'s code. Press the "Check authenticity" button, and the element with id "hasil-cek" shows "Identical" if they\'re the same, or "Different" if they\'re not.',
      'But extra spaces and uppercase/lowercase shouldn\'t count as different, okay? "Hello  World" and "hello world" are still identical. A copy is a copy 😅'
    ],
    reqs: [
      { label: 'Two text boxes and a Check authenticity button', ask: 'the text boxes or the Check authenticity button aren\'t there yet' },
      { label: 'Exactly the same text: "Identical"', ask: 'I put in two identical texts, but the result isn\'t "Identical" yet' },
      { label: 'Different spacing and letter case still "Identical"', ask: 'different spacing or letter case still counts as different' },
      { label: 'Different text: "Different"', ask: 'two clearly different texts got called identical' }
    ],
    catatan: {
      teks: 'Comparing text with <code>===</code> is very strict: a single space or one capital letter already counts as different. So tidy up both texts first: <code>toLowerCase()</code> for the letters, <code>replace(/\\s+/g, " ")</code> to turn runs of spaces, tabs or line breaks into a single space, and <code>trim()</code> to remove spaces at the ends. Only then compare them.',
      contoh: 'function rapikan(teks) {\n  return teks.toLowerCase().replace(/\\s+/g, " ").trim();\n}\nrapikan("  Good   Morning ") === rapikan("good morning"); // true',
      petunjuk: ['Make a rapikan(teks) function ("rapikan" means tidy up), then compare rapikan(a) === rapikan(b) when the button is pressed.', '<textarea id="kode-a"></textarea>\n<textarea id="kode-b"></textarea>\n<button onclick="cekKeaslian()">Check authenticity</button>\n<p id="hasil-cek"></p>\n\nfunction rapikan(teks) {\n  return teks.toLowerCase().replace(/\\s+/g, " ").trim();\n}\nfunction cekKeaslian() {\n  const a = rapikan(document.getElementById("kode-a").value);\n  const b = rapikan(document.getElementById("kode-b").value);\n  document.getElementById("hasil-cek").textContent = a === b ? "Identical" : "Different";\n}']
    },
    sukses: ['I tested my code against the Warung Kopi Senja code. The result... "Identical". Okay, I promise I\'ll start learning to make my own tomorrow 😅', 'Thank you, Mas. Truly.']
  },
  {
    judul: 'The file that appeared by itself',
    pesan: [
      'Mas... something weird is going on. A file called "timeline_b.json" suddenly showed up in my website folder. I never made that file.',
      'The file\'s date is two weeks from now. How is that possible?',
      'I\'m scared to open it. Can you read what\'s inside with code? Load it with fetch, then show it in the console with console.log(JSON.stringify(data, null, 2)), so it\'s neat and all readable.'
    ],
    reqs: [
      { label: 'timeline_b.json loaded with fetch', ask: 'the file hasn\'t been loaded with fetch yet' },
      { label: 'Contents shown in the console (console.log)', ask: 'the file\'s contents haven\'t shown up in the console yet' },
      { label: 'Shown neatly with JSON.stringify(data, null, 2)', ask: 'it\'s still one long line, not neat yet' }
    ],
    catatan: {
      teks: '<code>console.log</code> writes anything to the console. You can print an object directly, but <code>JSON.stringify(data, null, 2)</code> turns it into text indented by two spaces, so every field shows up on its own line. The second argument (<code>null</code>) is for filtering fields, and it isn\'t needed here. The result will appear in the console below the editor.',
      contoh: 'const profil = { nama: "Sari", kota: "Sengata" };\nconsole.log(JSON.stringify(profil, null, 2));\n// {\n//   "nama": "Sari",\n//   "kota": "Sengata"\n// }',
      petunjuk: ['Make a small async function: fetch, json(), then console.log with JSON.stringify(data, null, 2).', '<script>\n  async function bacaFileAneh() {\n    const respon = await fetch("timeline_b.json");\n    const data = await respon.json();\n    console.log(JSON.stringify(data, null, 2));\n  }\n  bacaFileAneh();\n<\/script>']
    },
    sukses: ['Mas... that\'s a photo of Bu Sari\'s shop. Closed. The date is two weeks from now.', '"JANGAN BUKA PORTAL SENGATA." "Don\'t open Portal Sengata." What does that mean, Mas? I\'m... going home for now. The free coffee still stands.']
  }
  ]
};

/* CodeQuest: English text for Bab 7 (Pak Lurah Hendra) */
CQ_BAB_EN[6] = {
  klien: {
    nama: 'Pak Lurah Hendra', usaha: 'Sengata Village Office',
    kirimTeks: 'I\'ve updated it, Pak Lurah. Please take a look.',
    revisiBuka: 'I have looked at it, son. But ', revisiDaftar: 'my staff still have some notes:', revisiTutup: 'That is quite all right. Government needs revisions too 😄'
  },
  reputasi: { alasan: 'the portal threw a 500 error in front of the village office staff' },
  unlock: ['Multiverse crack: the timeline branches'],
  hadiah: { teks: 'The village office sent a plaque: "Digital Partner of Kelurahan Sengata". It\'s already up on the corkboard.' },
  penutup: {
    judul: 'Seventh project done',
    teks: 'Sengata.id now has a sorted complaint list, a form with KTP validation, automatic priority status, drafts that survive a power cut, and error-proof sending to the server. But ever since that seventh report, something has cracked.'
  },
  pembuka: 'New project: Sengata.id. The biggest project so far. The rain outside is getting heavier.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sengata.id, Citizen Portal</title>
  <style>
    :root {
      --hijau: #1F6F5C;
      --latar: #F4F7F6;
      --teks: #1E2B28;
    }
    body {
      background-color: var(--latar);
      color: var(--teks);
      font-family: system-ui, sans-serif;
      max-width: 860px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      border-bottom: 4px solid var(--hijau);
      margin-bottom: 20px;
    }
    h1 {
      color: var(--hijau);
    }
  </style>
</head>
<body>
  <header>
    <h1>Sengata.id</h1>
    <p>The official citizen portal of Kelurahan Sengata.</p>
  </header>

  <section id="daftar">
    <h2>Citizen Complaints</h2>
    <div id="daftar-pengaduan"></div>
  </section>

  <section id="lapor">
    <h2>Report</h2>
  </section>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Complaint list',
    pesan: [
      'Good evening, {nama}. I am Hendra, the Lurah (village head) of Sengata. Your name comes up a lot among the residents: Pak Dedi, Kak Riko, even Bu Sari.',
      'Sengata must go digital. I am requesting an official portal for the village office. First, a list of residents\' complaints. The data is in pengaduan.json, and I have sent the village logo as well.',
      'Show each complaint in a box with the class "pengaduan": name, category, details, and status. Sort them from newest to oldest, so my staff do not miss the latest reports.'
    ],
    reqs: [
      { label: 'Sengata.id logo (logo-sengata.svg) shown with alt', ask: 'the village logo isn\'t showing yet, or it has no description' },
      { label: 'Data loaded from pengaduan.json with fetch', ask: 'the data isn\'t being read from pengaduan.json yet' },
      { label: 'Eight complaints shown (class="pengaduan")', ask: 'not all eight complaints are showing yet' },
      { label: 'Sorted from newest', ask: 'the order isn\'t newest first yet' },
      { label: 'No complaints typed in by hand', ask: 'some complaints are typed by hand in the HTML' }
    ],
    catatan: {
      teks: 'To sort an array, use <code>sort()</code> with a compare function. That function receives two items, <code>a</code> and <code>b</code>, and returns a number: negative means <code>a</code> goes first, positive means <code>b</code> goes first. A date in the format <code>"2026-09-24"</code> can be turned into a time with <code>new Date(text)</code>, and then subtracted. <code>b - a</code> gives you newest first.',
      contoh: 'const nilai = [{ nama: "A", skor: 70 }, { nama: "B", skor: 90 }];\nnilai.sort((a, b) => b.skor - a.skor);\n// B first, then A',
      petunjuk: ['After await respon.json(), sort with sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)), then build a box for each complaint.', '<img src="logo-sengata.svg" alt="Logo Sengata.id" width="64">\n\n<script>\n  let semuaPengaduan = [];\n\n  function tampilkan() {\n    const wadah = document.getElementById("daftar-pengaduan");\n    wadah.innerHTML = "";\n    semuaPengaduan.forEach(function (p) {\n      wadah.innerHTML += `\n        <div class="pengaduan">\n          <strong>${p.nama}</strong>, ${p.kategori}\n          <p>${p.isi}</p>\n          <span class="status">${p.status}</span>\n        </div>`;\n    });\n  }\n\n  async function muatPengaduan() {\n    const respon = await fetch("pengaduan.json");\n    semuaPengaduan = await respon.json();\n    semuaPengaduan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));\n    tampilkan();\n  }\n  muatPengaduan();\n<\/script>']
    },
    sukses: ['My staff saw Pak Hasan\'s bridge report right at the top. That is indeed the most urgent one. Well done, son.', 'First installment of funds from the village treasury.']
  },
  {
    judul: 'Citizen report form',
    pesan: [
      'Now a form for residents to file reports. Put it in the Report section.',
      'It has three fields: name, KTP number (the Indonesian ID card), and the report itself. Use the ids "nama", "ktp", and "laporan", and give the form the id "form-lapor". Every field must have a label. Many of our residents are elderly.',
      'The KTP field holds digits, but do not use type number. A KTP number can start with a zero and is not meant for arithmetic. Just use inputmode="numeric" so phones open the number keyboard straight away.'
    ],
    reqs: [
      { label: 'Form id="form-lapor" in the Report section', ask: 'the form isn\'t in the Report section yet' },
      { label: 'Fields #nama, #ktp, and #laporan (textarea)', ask: 'the name, KTP, or report field is still missing' },
      { label: 'Every field has a label', ask: 'some fields don\'t have a label yet' },
      { label: 'KTP field uses inputmode="numeric", not type="number"', ask: 'the KTP field is still type number, or doesn\'t use inputmode yet' },
      { label: 'Submit button', ask: 'the submit button isn\'t there yet' }
    ],
    catatan: {
      teks: 'Not every string of digits is a number. KTP numbers, phone numbers, and postal codes are never added up, and the leading zero matters. <code>type="number"</code> can drop that zero and shows odd up-and-down arrows. Use <code>type="text"</code> with <code>inputmode="numeric"</code>: it stays text, but phones show the number keyboard. The <code>maxlength="16"</code> attribute limits its length.',
      contoh: '<label for="hp">Phone number</label>\n<input type="text" id="hp" inputmode="numeric" maxlength="13">',
      petunjuk: ['Make a <form id="form-lapor"> containing three label-and-field pairs, then a button.', '<form id="form-lapor">\n  <label for="nama">Full name</label>\n  <input type="text" id="nama" required>\n\n  <label for="ktp">KTP number (16 digits)</label>\n  <input type="text" id="ktp" inputmode="numeric" maxlength="16" required>\n\n  <label for="laporan">Report details</label>\n  <textarea id="laporan" rows="5" required></textarea>\n\n  <button type="submit">Send report</button>\n  <p id="pesan-error"></p>\n</form>']
    },
    sukses: ['My mother, who is 70, was able to fill it in by herself. She was very proud, son.', 'Second installment of funds.']
  },
  {
    judul: 'KTP validation',
    pesan: [
      'My staff found a problem: some residents are playing pranks and entering "12345" as their KTP, and others use letters.',
      'A KTP number must be exactly 16 digits. If it is wrong, do not accept it, and show this in the element with the id "pesan-error": "KTP number must be 16 digits".',
      'If it is correct, the report goes straight to the top of the list with the status "Normal", and the error message disappears. And please do not let the page reload.'
    ],
    reqs: [
      { label: 'KTP "12345" rejected with the message "KTP number must be 16 digits"', ask: 'a KTP of "12345" is still accepted, or the message doesn\'t show up' },
      { label: 'KTP with letters rejected', ask: 'a KTP with letters in it is still accepted' },
      { label: 'A 16-digit KTP is accepted and goes to the top', ask: 'a report with a valid KTP doesn\'t go to the top of the list yet' },
      { label: 'Error message disappears after a valid KTP', ask: 'the error message still pops up even when the KTP is valid' },
      { label: 'Page doesn\'t reload (preventDefault)', ask: 'the page flickers and goes blank after sending' }
    ],
    catatan: {
      teks: 'A regular expression (regex) is a pattern for checking the shape of text. <code>/^\\d{16}$/</code> means: from the start (<code>^</code>) to the end (<code>$</code>), exactly 16 digits (<code>\\d{16}</code>). <code>pattern.test(text)</code> returns true or false. A new report is added to the front of the array with <code>unshift()</code>, and then the list is drawn again.',
      contoh: 'const kodePos = /^\\d{5}$/;\nkodePos.test("75611"); // true\nkodePos.test("7561a"); // false',
      petunjuk: ['In the submit event: preventDefault, then check /^\\d{16}$/.test(ktp). If it fails, write the message and return. If it passes, clear the message, unshift the new report, then call tampilkan().', 'document.getElementById("form-lapor").addEventListener("submit", function (event) {\n  event.preventDefault();\n  const ktp = document.getElementById("ktp").value.trim();\n  const pesanError = document.getElementById("pesan-error");\n  if (!/^\\d{16}$/.test(ktp)) {\n    pesanError.textContent = "KTP number must be 16 digits";\n    return;\n  }\n  pesanError.textContent = "";\n  semuaPengaduan.unshift({\n    nama: document.getElementById("nama").value,\n    kategori: "Umum",\n    isi: document.getElementById("laporan").value,\n    tanggal: new Date().toISOString().slice(0, 10),\n    status: "Normal"\n  });\n  tampilkan();\n});']
    },
    sukses: ['Now the pranksters get told off by the website itself. I do not even have to step in 😄', 'Third installment of funds.']
  },
  {
    judul: 'Priority reports',
    pesan: [
      'I have a new policy. Long reports are usually serious problems, since residents go to the trouble of writing out the details.',
      'So: if a report is more than 100 words, its status is "Priority". If it is 100 words or fewer, "Normal".',
      'My staff will test it with a 101-word report, an exactly 100-word report, a short report, and a report with messy spacing.'
    ],
    reqs: [
      { label: 'A 101-word report gets Priority status', ask: 'a 101-word report doesn\'t become Priority yet' },
      { label: 'A 20-word report gets Normal status', ask: 'a short report became Priority instead' },
      { label: 'Exactly 100 words is still Normal', ask: 'a report of exactly 100 words should still be Normal' },
      { label: 'Double spaces and line breaks aren\'t counted as words', ask: 'a 100-word report with messy spacing gets counted as more than 100' }
    ],
    catatan: {
      teks: 'Counting words means splitting the text at every space with <code>split()</code>. But <code>split(" ")</code> goes wrong when there are double spaces or line breaks, because the empty pieces get counted too. Split with the regex <code>/\\s+/</code> after <code>trim()</code>, or filter out the empty pieces with <code>filter(Boolean)</code>. Then use <code>if/else</code> to decide the status.',
      contoh: 'const kalimat = "  one   two\\nthree ";\nkalimat.trim().split(/\\s+/).length; // 3',
      petunjuk: ['Count the words in the report, then decide the status: more than 100 means "Priority", anything else is "Normal".', 'const isi = document.getElementById("laporan").value;\nconst jumlahKata = isi.trim().split(/\\s+/).filter(Boolean).length;\nlet status;\nif (jumlahKata > 100) {\n  status = "Priority";\n} else {\n  status = "Normal";\n}']
    },
    sukses: ['Pak Samsul\'s long report about the drainage ditch got the Priority label right away. He even phoned to say thank you.', 'Fourth installment of funds.']
  },
  {
    judul: 'Save draft',
    pesan: [
      'Yesterday there was heavy rain and the power went out across the whole village. Bu Ani had written a long report, and then... it was all gone 😔',
      'Please save the report draft automatically whenever a resident types, using localStorage. When the page is opened again, the text comes back.',
      'But once the report has been sent successfully, delete the draft, so the next resident does not see someone else\'s writing.'
    ],
    reqs: [
      { label: 'Draft saved on every keystroke (input event)', ask: 'while typing, the draft isn\'t being saved yet' },
      { label: 'Reopened: the draft comes back', ask: 'I opened the page again and the draft was gone' },
      { label: 'After sending, the draft is deleted', ask: 'after the report was sent, the draft is still saved' }
    ],
    catatan: {
      teks: 'The <code>input</code> event fires on every keystroke, so it is perfect for saving a draft. When the page opens, fill the field from <code>localStorage.getItem</code>, and add <code>|| ""</code> so it doesn\'t say "null". Once the report is accepted, delete the draft with <code>localStorage.removeItem</code>. The storage key must be unique. Remember the lesson from Mas Alif.',
      contoh: 'const catatan = document.getElementById("catatan");\ncatatan.value = localStorage.getItem("catatan_draft") || "";\ncatatan.addEventListener("input", function () {\n  localStorage.setItem("catatan_draft", catatan.value);\n});',
      petunjuk: ['Use a unique key, for example "sengata_draft_v1". Fill the textarea when the page opens, save in the input event, then removeItem once the report is accepted.', 'const KUNCI_DRAFT = "sengata_draft_v1";\nconst kolomLaporan = document.getElementById("laporan");\nkolomLaporan.value = localStorage.getItem(KUNCI_DRAFT) || "";\nkolomLaporan.addEventListener("input", function () {\n  localStorage.setItem(KUNCI_DRAFT, kolomLaporan.value);\n});\n\n// in the submit event, after the report is accepted:\nlocalStorage.removeItem(KUNCI_DRAFT);\nkolomLaporan.value = "";']
    },
    sukses: ['Bu Ani tried writing, and then I pulled the plug on her laptop. Her writing survived! She nearly cried, son.', 'Fifth installment of funds.']
  },
  {
    judul: 'Send to the village server',
    pesan: [
      'Lastly, and this is the most important part. Reports must actually reach the village office server, not just appear on the screen.',
      'Send the data with fetch to "api/lapor", method POST, with JSON.stringify of the report as the body. The new report appears in the list only if the server\'s response is ok.',
      'Our server is still quite temperamental. If the response is not ok, show "Server is having problems" and do not delete the draft. My staff will send seven reports in a row to test it.'
    ],
    reqs: [
      { label: 'Report sent with fetch POST to api/lapor (JSON)', ask: 'the report isn\'t being sent to api/lapor with POST yet' },
      { label: 'The first six reports go into the list', ask: 'out of seven reports, the first six don\'t all make it in yet' },
      { label: 'Seventh report: "Server is having problems" appears', ask: 'when the seventh report failed, the message "Server is having problems" didn\'t show up' },
      { label: 'The seventh report\'s draft isn\'t deleted', ask: 'the seventh report failed, but its draft got deleted anyway' },
      { label: 'Clean console during testing', ask: 'the console went red while my staff were testing' }
    ],
    catatan: {
      teks: '<code>fetch</code> can send data too. Give it a second object containing <code>method: "POST"</code>, <code>headers</code> saying the content is JSON, and <code>body: JSON.stringify(data)</code>. A server that answers with an error, such as 500, does not make fetch fail. That is why you should always check <code>respon.ok</code>. Only a dropped network connection lands in <code>catch</code>, so you need to handle both.',
      contoh: 'const respon = await fetch("api/simpan", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ judul: "Hello" })\n});\nif (!respon.ok) {\n  // the server refused or had an error\n}',
      petunjuk: ['Make the submit function async. Send with fetch POST. If !respon.ok or it lands in catch, show "Server is having problems" and stop without deleting the draft.', 'form.addEventListener("submit", async function (event) {\n  event.preventDefault();\n  // ... validate the KTP and work out the status as before ...\n  const laporanBaru = { nama, kategori: "Umum", isi, tanggal: new Date().toISOString().slice(0, 10), status };\n  try {\n    const respon = await fetch("api/lapor", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(laporanBaru)\n    });\n    if (!respon.ok) throw new Error("Server " + respon.status);\n    semuaPengaduan.unshift(laporanBaru);\n    tampilkan();\n    localStorage.removeItem(KUNCI_DRAFT);\n    kolomLaporan.value = "";\n    pesanError.textContent = "";\n  } catch (error) {\n    pesanError.textContent = "Server is having problems. Your report has been saved as a draft.";\n  }\n});']
    },
    sukses: [
      '...Son? Are you still there?',
      'That seventh report got a 500 error from the server, exactly like your test, and the message showed up neatly. But my staff say something is strange.',
      'In the server log there is one report we never sent. It was sent in your name, {nama}, and dated two weeks from now. It is just one sentence: "Warung Kopi Senja is closed. Please help."',
      'I will still release the village funds. But be careful, son. The rain tonight is strange.'
    ]
  }
  ]
};

/* CodeQuest: English text for Bab 8 ({nama} (Timeline B)) */
CQ_BAB_EN[7] = {
  klien: {
    nama: '{nama} (Timeline B)', usaha: 'Warung Kopi Senja · Timeline B',
    kirimTeks: 'I cleaned it up. Try running it.',
    revisiBuka: 'I tried running it. But ', revisiDaftar: 'a few things still aren\'t sorted:', revisiTutup: 'It\'s okay. We\'ve been worse than this before.'
  },
  pengantar: 'The crack in the window glass pulses softly. A message arrives on your phone, from a number you know very well: your own.',
  bisikan: 'Your phone buzzes. The sender is... your own number.',
  tanpaBayarTeks: 'No payment from this timeline. But one color returns to the photo of the warung.',
  unlock: ['Refactor skill', 'Anti-Spaghetti Glasses (detect duplicate lines of code in the console)'],
  hadiah: { teks: 'You (Timeline B) left the Anti-Spaghetti Glasses with you. They\'re on the desk now, in front of the laptop. If your code has lots of duplicate lines, the console will let you know.' },
  penutup: {
    judul: 'Timeline B, cleaned up',
    teks: 'Ten copied formulas are now one hitung function, one hitungItem, one PAJAK constant, and one formatRupiah, complete with comments for yourself three months from now. The code is shorter and can be changed in one place. The photo of the warung in the frame is back in color.'
  },
  pembuka: 'You touch the crack in the glass. Cold. Then everything turns grey. The studio is still the same, but the calendar on the wall is two weeks ahead, and the colors have drained from the room.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Warung Kopi Senja (Timeline B)</title>
  <style>
    body {
      background-color: #E4E4E4;
      color: #333333;
      font-family: Georgia, serif;
      max-width: 640px;
      margin: 0 auto;
      padding: 20px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px dashed #AAAAAA;
    }
    .item span:first-child {
      flex: 1;
    }
    .item input {
      width: 56px;
    }
    #total {
      font-size: 22px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Warung Kopi Senja</h1>
  <p>Emergency cashier. Don't touch it. Everything will break.</p>

  <div class="item"><span>Kopi Tubruk</span> <span class="harga">Rp8.000</span> <input type="number" id="jml1" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (8000 * Number(document.getElementById('jml1').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Es Kopi Susu</span> <span class="harga">Rp15.000</span> <input type="number" id="jml2" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (15000 * Number(document.getElementById('jml2').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Teh Tarik</span> <span class="harga">Rp10.000</span> <input type="number" id="jml3" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (10000 * Number(document.getElementById('jml3').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Pisang Goreng</span> <span class="harga">Rp12.000</span> <input type="number" id="jml4" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (12000 * Number(document.getElementById('jml4').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Roti Bakar</span> <span class="harga">Rp14.000</span> <input type="number" id="jml5" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (14000 * Number(document.getElementById('jml5').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Kopi Susu Gula Aren</span> <span class="harga">Rp18.000</span> <input type="number" id="jml6" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (18000 * Number(document.getElementById('jml6').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Teh Manis</span> <span class="harga">Rp6.000</span> <input type="number" id="jml7" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (6000 * Number(document.getElementById('jml7').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Mie Rebus</span> <span class="harga">Rp13.000</span> <input type="number" id="jml8" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (13000 * Number(document.getElementById('jml8').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Tahu Isi</span> <span class="harga">Rp5.000</span> <input type="number" id="jml9" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (5000 * Number(document.getElementById('jml9').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>
  <div class="item"><span>Wedang Jahe</span> <span class="harga">Rp9.000</span> <input type="number" id="jml10" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (9000 * Number(document.getElementById('jml10').value) * 1.1).toLocaleString('id-ID')">Calculate</button></div>

  <p id="total">Total: Rp0</p>
</body>
</html>
`,
  tugas: [
  {
    judul: 'One hitung function',
    pesan: [
      'Hi. Yeah, it\'s me. You. The version that\'s two weeks older and a lot more tired.',
      'In my timeline, Warung Kopi Senja closed. Not because it was quiet. The cashier kept breaking, and every time I tried to fix it I had to change ten places at once. In the end Bu Sari gave up.',
      'Look at the code. Ten buttons, the formula copied ten times. Please make one function hitung(harga, jumlah) ("hitung" means calculate, "harga" is price, "jumlah" is quantity) that returns price × quantity plus 10% tax, then make every button use that function. The cashier has to keep working.'
    ],
    reqs: [
      { label: 'There\'s a hitung(harga, jumlah) function', ask: 'the hitung(harga, jumlah) function isn\'t there yet' },
      { label: 'hitung(8000, 3) returns 26400', ask: 'hitung(8000, 3) doesn\'t return 26400 yet' },
      { label: 'hitung(5000, 0) returns 0', ask: 'hitung(5000, 0) should be 0' },
      { label: 'The tax formula (× 1.1) is written only once', ask: 'the × 1.1 formula is still scattered all over the place' },
      { label: 'All ten Calculate buttons still work correctly', ask: 'one of the Calculate buttons now gives the wrong result' }
    ],
    catatan: {
      teks: 'Code copied over and over is like a recipe rewritten on ten pieces of paper: if the measurements change, you have to remember to update all ten. The <b>DRY</b> principle (Don\'t Repeat Yourself) means write it once in a function, then call it wherever you need it. A function takes <b>parameters</b> (the ingredients), and hands back a result with <code>return</code>. Changing the shape of code without changing what it produces is called <b>refactoring</b>.',
      contoh: 'function luasPersegi(sisi) {\n  return sisi * sisi;\n}\nluasPersegi(4); // 16',
      petunjuk: ['Write function hitung(harga, jumlah) { return harga * jumlah * 1.1; } inside <script>, then replace the formula in every onclick with hitung(8000, Number(...)).', '<script>\n  function hitung(harga, jumlah) {\n    return harga * jumlah * 1.1;\n  }\n<\/script>\n\n<!-- one row as an example; repeat for the other nine menu items -->\n<button onclick="document.getElementById(\'total\').innerText = \'Total: Rp\' + hitung(8000, Number(document.getElementById(\'jml1\').value)).toLocaleString(\'id-ID\')">Calculate</button>']
    },
    sukses: ['...Did you see that? The photo of the warung in the frame. There\'s a little orange on the roof.', 'I can\'t pay you. Here, all my money goes to paying off debts. But thanks. Seriously.']
  },
  {
    judul: 'One function for every button',
    pesan: [
      'The formula is in one place now. But every button still carries a long sentence: grab this input, grab that total.',
      'Make a function hitungItem(tombol) ("tombol" means button) that any button can use. Store the price in a data-harga attribute on each .item row, so the function just reads it from there.',
      'Each button\'s onclick should be 40 characters at most. For example, just hitungItem(this).'
    ],
    reqs: [
      { label: 'Every .item has a data-harga matching its price', ask: 'some .item rows don\'t have a data-harga yet, or the price doesn\'t match' },
      { label: 'Each button\'s onclick is at most 40 characters', ask: 'the onclick code on the buttons is still really long' },
      { label: 'All ten Calculate buttons still work correctly', ask: 'one of the Calculate buttons gives the wrong result' },
      { label: 'Clean console', ask: 'the console went red when I pressed the buttons' }
    ],
    catatan: {
      teks: 'Inside <code>onclick</code>, the word <code>this</code> means the element that was clicked. From that button, <code>closest(".item")</code> climbs up to the row wrapped around it, and <code>querySelector("input")</code> finds the quantity field in that row only. Data like a price can be stored in the HTML with a <code>data-*</code> attribute, then read through <code>dataset</code>. That way one function can serve ten buttons.',
      contoh: '<div class="kartu" data-stok="12">\n  <button onclick="cekStok(this)">Check</button>\n</div>\n\n<script>\n  function cekStok(tombol) {\n    const kartu = tombol.closest(".kartu");\n    console.log(kartu.dataset.stok); // "12"\n  }\n<\/script>',
      petunjuk: ['Add data-harga="8000" to <div class="item">, then each button only needs onclick="hitungItem(this)". Inside hitungItem, get the row, its price, and its quantity.', '<div class="item" data-harga="8000"><span>Kopi Tubruk</span> <span class="harga">Rp8.000</span> <input type="number" value="0" min="0"> <button onclick="hitungItem(this)">Calculate</button></div>\n\n<script>\n  function hitungItem(tombol) {\n    const baris = tombol.closest(".item");\n    const harga = Number(baris.dataset.harga);\n    const jumlah = Number(baris.querySelector("input").value);\n    document.getElementById("total").innerText = "Total: Rp" + hitung(harga, jumlah).toLocaleString("id-ID");\n  }\n<\/script>']
    },
    sukses: ['The buttons are all short now. You can read the code without holding your breath.', 'The tree in front of the warung in that photo is green again.']
  },
  {
    judul: 'Tax goes up',
    pesan: [
      'News from my timeline: the tax went up to 11%. Back then, in the old code, I had to change ten numbers. I missed one. The cashier miscalculated for a week, and customers complained.',
      'Make a constant at the top of the script: const PAJAK = 0.11 ("pajak" means tax). Then use PAJAK in the formula. No more tax numbers written directly into the code.',
      'A number written directly in the middle of a formula is called a magic number. It seems harmless, until one day it has to change.'
    ],
    reqs: [
      { label: 'There\'s a PAJAK constant with the value 0.11', ask: 'the PAJAK = 0.11 constant isn\'t there yet' },
      { label: 'hitung(8000, 3) is now 26640', ask: 'hitung(8000, 3) isn\'t 26640 yet, the tax isn\'t 11% yet' },
      { label: 'The tax number is written only once, in PAJAK', ask: 'there\'s still a tax number (1.1, 0.1, or 0.11) written directly in the code' },
      { label: 'All ten Calculate buttons are correct with 11% tax', ask: 'some buttons aren\'t using the 11% tax yet' }
    ],
    catatan: {
      teks: 'A number written directly in the middle of a formula is called a <b>magic number</b>. Other people, and you yourself three months from now, won\'t know what it means, and it\'s hard to find when it needs changing. Give it a name with <code>const</code> at the top of the script. Constants that never change are usually named in UPPER_CASE.',
      contoh: 'const ONGKIR_PER_KM = 2500;\n\nfunction ongkir(km) {\n  return km * ONGKIR_PER_KM;\n}',
      petunjuk: ['Write const PAJAK = 0.11; on the first line of the script, then change the formula to harga * jumlah * (1 + PAJAK).', 'const PAJAK = 0.11;\n\nfunction hitung(harga, jumlah) {\n  return harga * jumlah * (1 + PAJAK);\n}']
    },
    sukses: ['Change one line, and all ten menu items are right. If only I\'d known this two weeks ago.', 'The sign in that photo is starting to show its color.']
  },
  {
    judul: 'Separate calculating and displaying',
    pesan: [
      'The next problem that used to keep me up all night: numbers and display all mixed up in one sentence.',
      'Make a function formatRupiah(angka) ("angka" means number) that returns text like "Rp26.640", rounded with no decimals. The hitung function should only calculate, and never touch the page at all.',
      'The total shown on the page has to go through formatRupiah too, so the format is always the same.'
    ],
    reqs: [
      { label: 'formatRupiah(26640) returns "Rp26.640"', ask: 'formatRupiah(26640) doesn\'t return "Rp26.640" yet' },
      { label: 'formatRupiah(1500000) returns "Rp1.500.000"', ask: 'formatRupiah(1500000) isn\'t "Rp1.500.000" yet' },
      { label: 'Decimals are rounded: formatRupiah(1234.5) → "Rp1.235"', ask: 'decimal numbers aren\'t being rounded yet' },
      { label: 'The hitung function doesn\'t touch document', ask: 'the hitung function is still changing the page' },
      { label: 'Total shown through formatRupiah, and all buttons correct', ask: 'the total isn\'t shown through formatRupiah yet' }
    ],
    catatan: {
      teks: 'A good function does one thing. <code>hitung</code> just calculates the number, <code>formatRupiah</code> just turns a number into text, and <code>hitungItem</code> is the one that puts the result on the page. Split up like this, each one can be tested on its own and reused. <code>Math.round()</code> rounds to the nearest whole number.',
      contoh: 'function formatSuhu(angka) {\n  return Math.round(angka) + "°C";\n}\nformatSuhu(27.6); // "28°C"',
      petunjuk: ['formatRupiah returns "Rp" + Math.round(angka).toLocaleString("id-ID"). Then in hitungItem, write the total through formatRupiah(hitung(harga, jumlah)).', 'function formatRupiah(angka) {\n  return "Rp" + Math.round(angka).toLocaleString("id-ID");\n}\n\nfunction hitungItem(tombol) {\n  const baris = tombol.closest(".item");\n  const harga = Number(baris.dataset.harga);\n  const jumlah = Number(baris.querySelector("input").value);\n  document.getElementById("total").innerText = "Total: " + formatRupiah(hitung(harga, jumlah));\n}']
    },
    sukses: ['Now if Bu Sari ever asks for the format "Rp 26.640,-", you just change one function.', 'The sky in that photo is turning orange. Like that afternoon when we first made the sign.']
  },
  {
    judul: 'Comments for yourself',
    pesan: [
      'Three months ago I opened my own code and didn\'t understand a thing. It felt like reading a letter from a stranger.',
      'Write a JSDoc comment above the hitung function: /** ... */ with @param for harga and jumlah, and @returns for the result.',
      'One more thing: leave one // TODO: comment for something you haven\'t got around to yet. Be honest. A TODO isn\'t something to be ashamed of, it\'s a little promise to yourself.'
    ],
    reqs: [
      { label: 'There\'s a /** */ comment right above the hitung function', ask: 'the /** */ comment above the hitung function isn\'t there yet' },
      { label: 'The comment has @param harga, @param jumlah, and @returns', ask: 'the comment doesn\'t explain @param harga, @param jumlah, and @returns yet' },
      { label: 'There\'s a // TODO: comment with something in it', ask: 'the // TODO: comment isn\'t there yet, or it\'s still empty' },
      { label: 'All buttons still work and the console is clean', ask: 'after adding the comments, a button broke or the console went red' }
    ],
    catatan: {
      teks: 'A <b>JSDoc</b> comment is written with <code>/** ... */</code> right above a function. <code>@param</code> describes each parameter, and <code>@returns</code> describes the result. Many editors read these comments and show them when you call the function. A <code>// TODO:</code> comment marks unfinished work, and editors can gather them all into one list. Good comments explain <i>why</i>, because the <i>what</i> can already be read from the code.',
      contoh: '/**\n * Calculates the area of a rectangle.\n * @param {number} panjang Length in meters\n * @param {number} lebar Width in meters\n * @returns {number} Area in square meters\n */\nfunction luas(panjang, lebar) {\n  return panjang * lebar;\n}',
      petunjuk: ['Write a /** */ block right above function hitung, containing @param {number} harga, @param {number} jumlah, and @returns. Then add one // TODO: line anywhere in the script.', '/**\n * Calculates the order price including tax.\n * @param {number} harga Price of one serving, in rupiah\n * @param {number} jumlah Number of servings\n * @returns {number} Total price including tax\n */\nfunction hitung(harga, jumlah) {\n  return harga * jumlah * (1 + PAJAK);\n}\n\n// TODO: save the daily order history for Bu Sari']
    },
    sukses: ['I read your TODO just now. Funny. I wanted to make that too once.', 'The photo is almost full color. Just one more to go.']
  },
  {
    judul: 'Calculate all',
    pesan: [
      'Last one. This is the one I never got around to making.',
      'Add a "Calculate all" button that adds up every order, tax included, and shows it in #total. Use the functions you already have. Don\'t copy the formula again.',
      'The per-item buttons keep working as usual. The staff in my timeline will try: Kopi Tubruk 2, Pisang Goreng 1, Wedang Jahe 3.'
    ],
    reqs: [
      { label: 'There\'s a "Calculate all" button', ask: 'the "Calculate all" button isn\'t there yet' },
      { label: 'Kopi Tubruk 2, Pisang Goreng 1, Wedang Jahe 3 → Rp61.050', ask: 'for Kopi Tubruk 2, Pisang Goreng 1, and Wedang Jahe 3, the total isn\'t Rp61.050 yet' },
      { label: 'All quantities 0 → Rp0', ask: 'when every quantity is 0, the total isn\'t Rp0 yet' },
      { label: 'Per-item buttons still correct', ask: 'the per-item Calculate buttons are wrong now' },
      { label: 'Clean console', ask: 'the console went red when I tried it' }
    ],
    catatan: {
      teks: 'To add up every row, grab them all with <code>querySelectorAll(".item")</code>, then run <code>forEach</code> or <code>reduce</code>. <code>reduce</code> carries one value, such as a running total, from one item to the next. Since <code>hitung</code> and <code>formatRupiah</code> already exist, this new button just uses them.',
      contoh: 'const angka = [3, 5, 2];\nconst total = angka.reduce((jumlah, n) => jumlah + n, 0);\n// total = 10',
      petunjuk: ['Make a <button onclick="hitungSemua()">Calculate all</button> outside the .item rows. In hitungSemua, turn the NodeList into an array with Array.from, then run reduce.', '<button onclick="hitungSemua()">Calculate all</button>\n\n<script>\n  function hitungSemua() {\n    const semua = Array.from(document.querySelectorAll(".item"));\n    const total = semua.reduce(function (jumlah, baris) {\n      const harga = Number(baris.dataset.harga);\n      const porsi = Number(baris.querySelector("input").value);\n      return jumlah + hitung(harga, porsi);\n    }, 0);\n    document.getElementById("total").innerText = "Total: " + formatRupiah(total);\n  }\n<\/script>']
    },
    sukses: [
      'All the colors are back.',
      'I just realized something. This warung didn\'t close because Bu Sari was lazy, or because the customers left. It closed because the code was left tangled until nobody dared to touch it. Me included.',
      'You\'re not at that point yet. Don\'t let it get there, okay?',
      'Here, take my glasses. They\'re supposedly Anti-Spaghetti Glasses. I bought them back when I was still optimistic 😅',
      '...Huh. The crack is shifting. Looks like another timeline is calling you.'
    ]
  }
  ]
};

/* CodeQuest: English text for Bab 9 ({nama}, Success Timeline) */
CQ_BAB_EN[8] = {
  klien: {
    nama: '{nama} (Success Timeline)', usaha: 'Warung Kopi Senja · 3 Branches',
    kirimTeks: 'Optimized it. Check the score.',
    revisiBuka: 'I checked it on a potato phone. But ', revisiDaftar: 'a few things are still slowing it down:', revisiTutup: "Relax. I was like that too, before I made it 😎"
  },
  pengantar: 'The crack in the glass shifts and glints gold. Your phone rings again: your own number, but the profile photo is wearing sunglasses.',
  bisikan: 'Your phone buzzes. Your own number again, this time with a 😎 emoji.',
  unlock: ['Web Performance Skill', 'Flash drive with a studio blueprint'],
  hadiah: { teks: 'You (Success Timeline) left you a golden flash drive. There is one file on it: blueprint-studio.txt.' },
  penutup: {
    judul: 'Success Timeline, even faster',
    teks: 'The Warung Kopi Senja franchise website went from 20 MB down to about 1 MB: WebP images, a lazy gallery, clear image sizes, clean CSS, a script that no longer holds the page back, and a performance score above 85. The prospective partner from Balikpapan signed on.'
  },
  pembuka: 'You step through the crack. The studio is the same, but the city lights are brighter, and from the window you can see a billboard: WARUNG KOPI SENJA · 3 BRANCHES.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Warung Kopi Senja · 3 Branches</title>
  <script>
    // old analytics script: waits 300 milliseconds before the page may show ("analitik siap" = "analytics ready")
    const mulai = Date.now();
    while (Date.now() - mulai < 300) {}
    console.log("analitik siap");
  <\/script>
  <style>
    body {
      background-color: #1C1B29;
      color: #F4EBD0;
      font-family: system-ui, sans-serif;
      max-width: 960px;
      margin: 0 auto;
      padding: 16px;
    }
    .hero img {
      width: 100%;
      height: auto;
      border-radius: 10px;
    }
    .hero h1 {
      color: #E9C46A;
    }
    .galeri {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .galeri img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
    .banner-ramadan-2024 {
      background: #1F6F5C;
      padding: 20px;
    }
    .promo-lama {
      color: #E57373;
      font-weight: bold;
    }
    #popup-diskon {
      position: fixed;
      inset: 30%;
      background: #FFFFFF;
    }
    .slider-lama {
      overflow: hidden;
      white-space: nowrap;
    }
    .slider-lama img {
      display: inline-block;
      width: 100%;
    }
    .testimoni-2023 {
      font-style: italic;
    }
    .kolom-iklan {
      float: right;
      width: 300px;
    }
  </style>
</head>
<body>
  <section class="hero">
    <img src="hero-hd.jpg" alt="Warung Kopi Senja in the late afternoon">
    <h1>Warung Kopi Senja</h1>
    <p>From one small warung in Sengata to three branches today. Now open for partnerships.</p>
  </section>

  <h2>Gallery</h2>
  <div class="galeri">
    <img src="cabang-sengata-hd.jpg" alt="Sengata branch">
    <img src="cabang-bontang-hd.jpg">
    <img src="cabang-samarinda-hd.jpg" alt="Samarinda branch">
    <img src="gorengan-hd.jpg" alt="Warm fritters">
    <img src="es-teh-jumbo-hd.jpg">
    <img src="suasana-malam-hd.jpg">
  </div>

  <footer>
    <p>Partnerships: kemitraan@warungkopisenja.id</p>
  </footer>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Compress the images',
    pesan: [
      "Yo! I'm you, the version that made it. Three branches, two employees, one delivery van. Don't look so shocked.",
      "But there's one embarrassing thing: my franchise website is painfully slow. On a potato phone it takes twelve seconds to open. Prospective partners bail before the page even shows up.",
      "Start with the images. They're all -hd.jpg files, some of them 4 MB. I've sent you .webp versions that are under 200 KB each. Swap every image for its .webp version, and make sure they all still show up."
    ],
    reqs: [
      { label: 'No more -hd.jpg images', ask: 'there are still -hd.jpg images being used' },
      { label: 'Every image is under 200 KB', ask: "there's still an image bigger than 200 KB" },
      { label: 'All seven images show up', ask: "an image isn't showing up, maybe there's a typo in the file name" }
    ],
    catatan: {
      teks: 'Images are usually the heaviest part of a page. A <code>-hd.jpg</code> photo straight from a camera can be several MB, even though on a phone screen it only shows up 400 pixels wide. The <b>WebP</b> format stores the same image at a much smaller size. A common rule of thumb: one image under 200 KB, and a whole page under 1 MB. Open the files from the client to see their sizes.',
      contoh: '<!-- 3.1 MB -->\n<img src="pantai-hd.jpg" alt="Beach">\n\n<!-- 150 KB, the same image -->\n<img src="pantai.webp" alt="Beach">',
      petunjuk: ['Change every file name: hero-hd.jpg becomes hero.webp, cabang-sengata-hd.jpg becomes cabang-sengata.webp, and so on.', '<img src="hero.webp" alt="Warung Kopi Senja in the late afternoon">\n\n<img src="cabang-sengata.webp" alt="Sengata branch">\n<img src="cabang-bontang.webp">\n<img src="cabang-samarinda.webp" alt="Samarinda branch">\n<img src="gorengan.webp" alt="Warm fritters">\n<img src="es-teh-jumbo.webp">\n<img src="suasana-malam.webp">']
    },
    sukses: ['From 20 MB to 1 MB. The page feels lighter right away. Nice one, past me 😎', 'Transfer sent. Call it cross-timeline pocket money.']
  },
  {
    judul: 'Lazy loading',
    pesan: [
      "Next: don't load every image at once. Visitors won't necessarily scroll all the way down to the gallery.",
      'Give the gallery images loading="lazy", so they only load when they\'re about to come into view.',
      'But the hero image at the very top should not be lazy. That\'s the first thing people see. In fact, give it fetchpriority="high", so it gets priority.'
    ],
    reqs: [
      { label: 'All six gallery images use loading="lazy"', ask: 'the gallery images aren\'t using loading="lazy" yet' },
      { label: 'The hero image is not lazy', ask: 'the hero image went lazy too, so it shows up late' },
      { label: 'The hero image uses fetchpriority="high"', ask: 'the hero image isn\'t using fetchpriority="high" yet' },
      { label: 'All images still show up', ask: 'some images stopped showing up' }
    ],
    catatan: {
      teks: 'The <code>loading="lazy"</code> attribute makes the browser hold off on loading an image until it\'s almost on screen. Perfect for a gallery further down. But the first image people see, usually the hero, needs to arrive as fast as possible: don\'t make it lazy, and give it <code>fetchpriority="high"</code> so the browser puts it first. The time until the largest image on screen appears is called <b>LCP</b> (Largest Contentful Paint).',
      contoh: '<img src="banner.webp" alt="Promo" fetchpriority="high">\n<img src="foto-1.webp" alt="Menu" loading="lazy">',
      petunjuk: ['Add loading="lazy" to all six .galeri images, and fetchpriority="high" to the .hero image.', '<img src="hero.webp" alt="Warung Kopi Senja in the late afternoon" fetchpriority="high">\n\n<div class="galeri">\n  <img src="cabang-sengata.webp" alt="Sengata branch" loading="lazy">\n  <!-- ...and the other five images, each with loading="lazy" -->\n</div>']
    },
    sukses: ["The gallery images wait their turn now. The hero pops up right away. That's what priorities look like, bro.", 'Second transfer.']
  },
  {
    judul: 'Image sizes',
    pesan: [
      "Did you notice that while the page is loading, the text keeps jumping down? That's because the browser doesn't know the image sizes yet.",
      'Give every image width and height attributes that match its real size: hero 1200×600, gallery 600×400. Keep the CSS height: auto, so the images stay responsive.',
      "It's called layout shift. Prospective partners don't like buttons that run away right when they're about to click 😅"
    ],
    reqs: [
      { label: 'Every image has width and height attributes', ask: "some images don't have width and height yet" },
      { label: 'The sizes match: hero 1200×600, gallery 600×400', ask: "the width and height numbers don't match the images' real sizes yet" },
      { label: 'Images stay responsive, no wider than the page', ask: 'the images are spilling off the screen now, or they got squashed' },
      { label: 'All images still show up', ask: 'some images stopped showing up' }
    ],
    catatan: {
      teks: 'If an <code>&lt;img&gt;</code> has no <code>width</code> and <code>height</code>, the browser reserves zero pixels for it, then pushes the page content down as soon as the image finishes loading. This shifting is called <b>CLS</b> (Cumulative Layout Shift). With both attributes, the browser knows the image\'s aspect ratio from the start. The CSS <code>width: 100%; height: auto;</code> still makes the image fit the screen.',
      contoh: '<img src="foto.webp" alt="Photo" width="800" height="600">\n\n<style>\n  img { width: 100%; height: auto; }\n</style>',
      petunjuk: ['Add width="1200" height="600" to the hero image, and width="600" height="400" to every gallery image. The CSS doesn\'t need to change.', '<img src="hero.webp" alt="Warung Kopi Senja in the late afternoon" width="1200" height="600" fetchpriority="high">\n<img src="cabang-sengata.webp" alt="Sengata branch" width="600" height="400" loading="lazy">']
    },
    sukses: ['Nothing jumps anymore. Neat as the display case at the Samarinda branch.', 'Third transfer.']
  },
  {
    judul: 'Unused CSS',
    pesan: [
      "The CSS is also full of leftovers from old promos. The Ramadan 2024 banner, a discount popup, a slider we ditched ages ago... it all still gets loaded every single time.",
      "Delete every CSS rule that isn't used by any element on the page. But be careful, don't break how the hero and the gallery look."
    ],
    reqs: [
      { label: 'No unused CSS rules', ask: "there are still leftover CSS rules from old promos that aren't used" },
      { label: 'The .hero and .galeri styles are still there', ask: 'the hero or gallery styles got deleted too' },
      { label: 'All images still show up', ask: 'some images stopped showing up' }
    ],
    catatan: {
      teks: "Every CSS rule still gets downloaded and read by the browser, even if no element matches its selector. How to check: look for the selector's class or id in the HTML. If no element uses it, that rule is safe to delete. In Chrome, the <b>Coverage</b> panel in DevTools marks unused CSS in red.",
      contoh: '/* used: there is a <div class="menu"> */\n.menu { display: flex; }\n\n/* not used: there is no class="promo-2022" in the HTML */\n.promo-2022 { color: red; }',
      petunjuk: ["Check them one by one: .banner-ramadan-2024, .promo-lama, #popup-diskon, .slider-lama, .slider-lama img, .testimoni-2023, and .kolom-iklan aren't used in the HTML. Delete all seven.", '<style>\n  body { /* ...unchanged... */ }\n  .hero img { width: 100%; height: auto; border-radius: 10px; }\n  .hero h1 { color: #E9C46A; }\n  .galeri { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }\n  .galeri img { width: 100%; height: auto; border-radius: 8px; }\n</style>']
    },
    sukses: ["Seven rules gone, and it looks exactly the same. Like cleaning out the storeroom and finding it's all empty boxes.", 'Fourth transfer.']
  },
  {
    judul: 'The script holding the page back',
    pesan: [
      'Just one slowpoke left: the analytics script in the <head>. That script makes the page wait 300 milliseconds before it\'s allowed to show. Every time it opens.',
      'Delete that while loop that just waits, then move the script to the end of the <body>, right before </body>.',
      'But the "analitik siap" log in the console ("analytics ready") has to stay. My marketing team checks for it.'
    ],
    reqs: [
      { label: 'No <script> inside <head>', ask: 'the script is still in the <head>' },
      { label: 'The waiting while loop is gone', ask: 'that while loop that just waits is still there' },
      { label: 'The console still logs "analitik siap"', ask: 'the "analitik siap" log in the console is gone' },
      { label: 'Clean console', ask: 'the console is red' }
    ],
    catatan: {
      teks: 'The browser reads HTML from top to bottom. As soon as it hits a <code>&lt;script&gt;</code> in the <code>&lt;head&gt;</code>, it stops and runs it first before drawing anything. A script like that is called <b>render-blocking</b>. Scripts that aren\'t needed for the first view are best placed at the end of the <code>&lt;body&gt;</code>, or given <code>defer</code> if they\'re a separate file. A <code>while</code> loop that only waits for time to pass makes the browser freeze completely.',
      contoh: '<body>\n  <h1>Hello</h1>\n  <!-- page content ... -->\n\n  <script>\n    console.log("script runs after the page content is read");\n  <\/script>\n</body>',
      petunjuk: ['Cut the whole <script> block out of the <head>, paste it before </body>, then delete two lines: const mulai = ... and while (...) {}.', '  <footer>\n    <p>Partnerships: kemitraan@warungkopisenja.id</p>\n  </footer>\n\n  <script>\n    console.log("analitik siap");\n  <\/script>\n</body>']
    },
    sukses: ['The page shows up instantly. No waiting. Like ordering coffee at the branch that has an espresso machine.', 'Fifth transfer.']
  },
  {
    judul: 'Pass the audit',
    pesan: [
      "Last one. Tomorrow a prospective partner from Balikpapan wants to look at the website. They'll definitely check it with Lighthouse.",
      'Add a <meta name="description"> that describes the warung, and make sure every image has a clear alt. Screen reader users are visitors too.',
      "Target: a performance score of at least 85 in the console. Back then I only got 41, and the partner walked away 😬"
    ],
    reqs: [
      { label: 'A clear meta description (at least 30 characters)', ask: "there's no meta description yet, or it's too short" },
      { label: 'Every image has a clear alt', ask: "some images still have no alt, or the alt is too short" },
      { label: 'Performance score of at least 85', ask: 'the performance score in the console is still under 85' }
    ],
    catatan: {
      teks: '<code>&lt;meta name="description"&gt;</code> is the page summary that shows up in Google search results. Write one or two honest sentences. The <code>alt</code> attribute is read aloud by screen readers for people who can\'t see the image, and it shows up if the image fails to load. Describe what\'s in the image, not "image1". The score in the console mimics how Lighthouse grades a page: image size, lazy loading, clear sizes, CSS and scripts, and basic accessibility.',
      contoh: '<meta name="description" content="A home bakery in Bontang. Pull-apart bread, pandan sponge cake, and orders for events.">\n\n<img src="bolu.webp" alt="Sliced green pandan sponge cake on a white plate">',
      petunjuk: ['Add a meta description in the <head>, then fill in the alt for cabang-bontang, es-teh-jumbo, and suasana-malam. Check the score in the console.', '<meta name="description" content="Warung Kopi Senja, from Sengata to three branches today. Kopi tubruk, warm fritters, and partnership opportunities.">\n\n<img src="cabang-bontang.webp" alt="Bontang branch with a blue roof" width="600" height="400" loading="lazy">\n<img src="es-teh-jumbo.webp" alt="A jumbo glass of iced tea with a red straw" width="600" height="400" loading="lazy">\n<img src="suasana-malam.webp" alt="The warung at night with warm yellow lights" width="600" height="400" loading="lazy">']
    },
    sukses: [
      "The score's over 85! The Balikpapan partner is definitely... wait. I want to be honest first.",
      "All of this, three branches, the delivery van, started with one decision: I stopped taking every project. I started my own studio. My own portfolio. Then the clients came.",
      "I'm leaving you this flash drive. It has the studio blueprint on it. Open it later, once you're back in your own timeline.",
      "Oh, and I've transferred the rest of the payment. Think of it as investing in yourself 😎"
    ]
  }
  ]
};

/* CodeQuest: English text for Bab 10 ({nama}, your own studio) */
CQ_BAB_EN[9] = {
  klien: {
    nama: '{nama}', usaha: 'Studio {nama}',
    kirimTeks: 'Okay, let me look at it again through a client\'s eyes.',
    revisiBuka: 'I went over it again, slowly. Turns out ', revisiDaftar: 'a few things are still missing:', revisiTutup: "It's okay. The pickiest client is always yourself 😌"
  },
  pengantar: 'The crack closes behind you. You go home to your own timeline, carrying the glasses, the flash drive, and one idea. Next client: you.',
  bisikan: "The flash drive on the desk blinks softly. There's one file on it.",
  tanpaBayarTeks: 'No payment yet. This project is an investment.',
  hadiah: { teks: 'Your studio nameplate goes up on the wall.' },
  penutup: { judul: 'A small studio stands', teks: 'The warung stays open.' },
  pembuka: 'You are back in your studio. The crack in the glass has closed, leaving only a faint mark. On the desk are the glasses, the flash drive, and a cup of tea that\'s still warm. The rain has thinned to a drizzle.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>My Studio</title>
  <style>
    body {
      background-color: #FBF6EC;
      color: #2B2A33;
      font-family: system-ui, sans-serif;
      margin: 0;
    }
    main {
      max-width: 860px;
      margin: 0 auto;
      padding: 24px;
    }
  </style>
</head>
<body>
  <main>
    <!-- This is your own page. No client calling the shots. -->

  </main>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Hero',
    pesan: [
      'Okay. Deep breath. No Bu Sari, no Pak Lurah. This time the client is you.',
      'The blueprint from the flash drive says: start with the hero, the very top section. Make an element with id="hero" containing an <h1> with your studio\'s name, and one paragraph that explains what you do, at least five words long.',
      "Just be honest. It doesn't have to sound impressive. It just has to sound like you."
    ],
    reqs: [
      { label: 'There is an element with id="hero"', ask: 'the id="hero" element isn\'t there yet' },
      { label: '#hero has an <h1> with the studio name', ask: "the hero doesn't have an <h1> with the studio name yet" },
      { label: '#hero has a paragraph of at least 5 words', ask: 'the paragraph in the hero is still under five words' }
    ],
    catatan: {
      teks: 'The <b>hero</b> is the first section visitors see: who you are and what you offer, on a single screen. It doesn\'t need to be long. One heading and one clear sentence are stronger than three paragraphs. You\'ve already built sections like this for your clients. Now it\'s for you.',
      contoh: '<section id="hero">\n  <h1>Dapur Rani</h1>\n  <p>Homemade cakes for birthdays and arisan gatherings.</p>\n</section>',
      petunjuk: ['Inside <main>, make a <section id="hero"> with an <h1> and a <p>. Write whatever you like, as long as the paragraph is at least five words.', '<section id="hero">\n  <h1>Studio {nama}</h1>\n  <p>I build small, tidy websites for warungs, shops, and communities around me.</p>\n</section>']
    },
    sukses: ["It looks like a real person who's open for business. Because you are."]
  },
  {
    judul: 'Work',
    pesan: [
      "Now the work section. You've made a lot: the warung signboard, the flower shop, the music café, the laundry calculator, the 17-an schedule, the village portal.",
      'Pick at least three. Make an element with id="karya" ("karya" means work) containing cards with class="karya". Each one has an <h3> with the project title and a <p> with its story.',
      "Write what you learned from each project, not just what you made. Clients like people who learn."
    ],
    reqs: [
      { label: 'There is an element with id="karya"', ask: 'the id="karya" element isn\'t there yet' },
      { label: 'At least three .karya cards inside #karya', ask: "there aren't three work cards yet" },
      { label: 'Every card has a filled-in <h3> and <p>', ask: 'some work cards are still missing an <h3> title or a <p> story' }
    ],
    catatan: {
      teks: "A good portfolio doesn't just show off results, it also shows how you think. For each project, write down the problem, what you made, and what you learned. Cards that share the same class can all be styled at once with a single CSS rule, for example a grid.",
      contoh: '<section id="karya">\n  <h2>Work</h2>\n  <article class="karya">\n    <h3>Laundry Kilat Calculator</h3>\n    <p>Calculates receipts with a subscriber discount. Lesson: other people\'s money can\'t be miscounted.</p>\n  </article>\n</section>',
      petunjuk: ['Make a <section id="karya"> with three <article class="karya">, each with an <h3> and a <p>.', '<section id="karya">\n  <h2>Work</h2>\n  <article class="karya">\n    <h3>Warung Kopi Senja</h3>\n    <p>My first signboard and menu. Learned HTML and CSS from scratch.</p>\n  </article>\n  <article class="karya">\n    <h3>Laundry Kilat</h3>\n    <p>A receipt calculator with a subscriber discount. Learned to count money carefully.</p>\n  </article>\n  <article class="karya">\n    <h3>Sengata.id</h3>\n    <p>A residents\' complaint portal. Learned fetch, validation, and handling a server that errors out.</p>\n  </article>\n</section>']
    },
    sukses: ["Read those cards again. Turns out you've come this far."]
  },
  {
    judul: 'Contact',
    pesan: [
      'People who like your work need to be able to reach you. Make a section with id="kontak" ("kontak" means contact) with an email link (mailto:) or a WhatsApp link (https://wa.me/62...).',
      'WhatsApp numbers use the international format: starting with 62, no leading zero, no plus sign, no spaces. For example https://wa.me/6281234567890.',
      "The link needs visible text, okay, not just an icon. And use contact details you'll actually reply to."
    ],
    reqs: [
      { label: 'There is an element with id="kontak"', ask: 'the id="kontak" element isn\'t there yet' },
      { label: 'A correct email (mailto:) or WhatsApp (wa.me/62…) link', ask: "there's no email or WhatsApp link yet, or its format isn't right" },
      { label: 'The link has visible text', ask: "the contact link doesn't have any text yet" }
    ],
    catatan: {
      teks: 'A <code>mailto:</code> link opens the email app with the recipient address already filled in. A <code>https://wa.me/</code> link followed by a number in international format opens a WhatsApp chat. Indonesia\'s country code is 62, so 0812... is written as 62812..., with no plus sign, spaces, or dashes.',
      contoh: '<a href="mailto:halo@dapurrani.id">halo@dapurrani.id</a>\n<a href="https://wa.me/6281234567890">Chat on WhatsApp</a>',
      petunjuk: ['Make a <section id="kontak"> with an <a href="mailto:...">. Put the email address or "Chat on WhatsApp" inside the link.', '<section id="kontak">\n  <h2>Contact</h2>\n  <p>Got a warung, a shop, or an event that needs a website?</p>\n  <a href="mailto:halo@studiosaya.id">halo@studiosaya.id</a>\n  <a href="https://wa.me/6281234567890">Chat on WhatsApp</a>\n</section>']
    },
    sukses: ['Now people can find you. A little scary. But good.']
  },
  {
    judul: 'A touch of JavaScript',
    pesan: [
      'Blueprint point four: a touch of JavaScript, so the page comes alive.',
      'Anything you like. A light/dark theme toggle, a "see details" button that opens a project\'s story, a greeting button that changes... What matters is a button that changes something on the page when you press it.',
      'And the console has to be clean. Your own studio, your own standards.'
    ],
    reqs: [
      { label: 'There is a button on the page', ask: "there's no button to press yet" },
      { label: 'Pressing the button changes something on the page', ask: 'I pressed the button, but nothing on the page changed yet' },
      { label: 'Clean console after pressing the button', ask: 'the console goes red after pressing the button' }
    ],
    catatan: {
      teks: 'Small interactions make a page feel alive. The most common pattern: a button changes an element\'s <code>class</code> with <code>classList.toggle()</code>, and CSS decides how it looks. You\'ve done this before at Ruang Nada, when you built dark mode.',
      contoh: '<button id="tombolDetail">See details</button>\n<p id="detail" hidden>Finished in two weeks.</p>\n\n<script>\n  document.getElementById("tombolDetail").addEventListener("click", function () {\n    const d = document.getElementById("detail");\n    d.hidden = !d.hidden;\n  });\n<\/script>',
      petunjuk: ['Make a "Dark mode" button that runs document.body.classList.toggle("gelap"), then write a CSS rule for body.gelap ("gelap" means dark).', '<button id="tombolTema">Dark mode</button>\n\n<style>\n  body.gelap { background-color: #1C1B29; color: #F4EBD0; }\n</style>\n\n<script>\n  document.getElementById("tombolTema").addEventListener("click", function () {\n    document.body.classList.toggle("gelap");\n  });\n<\/script>']
    },
    sukses: ['Click. It changes. Click again. Yep, I played with the button five times too.']
  },
  {
    judul: 'Tidy on phones, and your story',
    pesan: [
      'Most people will open your site on their phone. Add a <meta name="viewport"> and make sure the layout adapts to the screen: use @media, or flex-wrap, or a grid with auto-fit.',
      'Then one more section: id="cerita" ("cerita" means story). Tell your journey, at least 40 words. Where you started, why you kept going.',
      "This is the hardest part to write. That's normal. Just write it first, you can revise it later."
    ],
    reqs: [
      { label: 'There is a <meta name="viewport"> with width=device-width', ask: "there's no meta viewport yet" },
      { label: 'The layout adapts to the screen (@media, flex-wrap, or grid auto-fit)', ask: "the layout doesn't adapt to phone screens yet" },
      { label: 'The #cerita section has at least 40 words', ask: "the story section isn't there yet, or it's still under 40 words" }
    ],
    catatan: {
      teks: 'Without <code>&lt;meta name="viewport"&gt;</code>, a phone shows the page as if it were as wide as a laptop screen, then shrinks it down. After that, you can make the layout adapt to the screen: <code>@media (max-width: 600px)</code> for rules just for small screens, <code>flex-wrap: wrap</code> so cards drop to a new row, or <code>grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))</code> so the number of columns follows the screen width.',
      contoh: '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n<style>\n  .daftar { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }\n</style>',
      petunjuk: ['Add the meta viewport in the <head>, give #karya an auto-fit grid, then write a <section id="cerita"> with a paragraph of at least 40 words.', '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n<style>\n  #karya { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }\n</style>\n\n<section id="cerita">\n  <h2>Story</h2>\n  <p>I started with the signboard for a coffee warung in Sengata, on a rainy afternoon. The pay was free coffee. After that came a flower shop, a music café, a laundry, the 17-an committee, and even the village office. I kept going because every project made it a little easier for someone to run their business.</p>\n</section>']
    },
    sukses: ["I read your story. I'm not crying. Just got something in my eye."]
  },
  {
    judul: 'Publish', tombol: 'Publish to the internet', kirimTeks: 'Publish.',
    pesan: [
      'Done. Every section from the blueprint is there.',
      'Just one more button. This time it\'s not "Send to client". The button says "Publish to the internet". Before that, make sure everything is still complete and the console is clean.',
      'Nervous? Same.'
    ],
    reqs: [
      { label: 'Hero, work, and contact complete', ask: "the hero, work, or contact section isn't complete yet" },
      { label: 'A button that changes the page', ask: "the JavaScript button doesn't change anything yet" },
      { label: 'Tidy on phones, with a story of at least 40 words', ask: "the viewport, phone layout, or story isn't complete yet" },
      { label: 'Clean console', ask: 'the console is still red' }
    ],
    catatan: {
      teks: '<b>Publishing</b> or <b>deploying</b> means moving your website files onto a server anyone can open. For a site like this, free services like GitHub Pages or Netlify are plenty: upload <code>index.html</code>, and your site gets its own address. Before you publish, check one more time: links are correct, the console is clean, and it looks tidy on a phone. After that, don\'t wait for perfect.',
      contoh: 'studio-saya/\n├── index.html\n└── (images, if any)\n\n→ upload to GitHub Pages\n→ https://yourname.github.io/studio-saya/',
      petunjuk: ['Make sure #hero, #karya (3 cards), #kontak, the interactive button, the meta viewport, the responsive layout, and #cerita are all still there.', "There's no new code in this order. If something isn't ticked yet, open the notes from the previous orders again."]
    },
    sukses: ['Sent.', 'Your site is online now.']
  }
  ]
};

