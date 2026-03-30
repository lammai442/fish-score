## Testinstruktioner – FishScore

Applikationen finns tillgänglig på:  
http://fischscore.s3-website.eu-north-1.amazonaws.com/

### Förutsättningar för testet

- Använd två moderna webbläsare (t.ex. Chrome eller Edge)
- Använd **inte** inkognitoläget på webbläsaren.

**Bra info att veta**

- Appen använder WebSocket-teknik för realtidsuppdateringar, vilket innebär att sidan uppdateras automatiskt utan att behöva laddas om.
- Den som skapar ett nytt event blir automatiskt admin och kan få möjligheter att skapa lag och redigera eventet.
- För att få notiser behöver followstjärnan vara ifylld på eventet.
- Appen använder cookies som är giltiga i 10 timmar per aktiv session. Därför behöver du använda två separata webbläsare för att testa med två olika konton.

**Följ stegen nedan noggrant för att testa applikationen.**

---

### 1. Registrera och logga in

1. Skapa ett nytt konto (valfri e-post och lösenord).
2. Logga in med det nya kontot.

---

### 2. Skapa event och lag

1. Skapa ett nytt event och gå in i eventet.
2. Skapa 2 team med valfria namn.
3. Joina ett av lagen.

---

### 3. Logga in som annan användare

1. Öppna en ny webbläsare som inte är samma som du har nu och klistra in länken - http://fischscore.s3-website.eu-north-1.amazonaws.com/.
2. Logga in med följande konto:
    - E-post: moa@kalle.se
    - Lösenord: mamma1
3. Gå in i eventet som skapades i steg 2.
4. Gå med i det andra laget (inte samma som första användaren).

---

### 4. Lägg till catches

1. Skapa minst en catch per användare (båda kontona).
2. Kontrollera att uppdateringar sker korrekt mellan användarna.

---

### 5. Testa notifikationer

1. Observera notifikationsikonen:
    - Rör den på sig (animation)?
2. Klicka på notifikationsikonen.
3. Kontrollera att rätt uppdateringar visas (endast uppdateringar från andra användare visas här).

---

### 6. Testa meddelanden

1. Gå till messages-tabben i eventet.
2. Skicka minst ett meddelande.
3. Kontrollera att meddelandet syns för båda användarna.

---

### 7. Testa unfollow

1. Använd moa-kontot och klicka på stjärnan för att unfollowa eventet.
2. Gå till ditt egna konto och lägg in en ny fångst och en nytt meddelande. Observera på moa-kontot så kommer inga notifikationer för detta event.
3. På moa-kontot tryck på follow-stjärnan igen.
4. Gå till ditt nya konto och lägg in ny fångst så ska notifikationer fungera igen för moa-kontot.

---

### 8. Se profilsidan

1. I headern kan du trycka på dina initialer.
2. Här finns en samlad bild över dina fångster.

---

### 9. Redigera fångst

**Redigering av ens egna fångst går att utföra på eventsidan eller profilsidan.**

1. Via eventsidan gå till taben **Activity**.
2. Leta upp en av dina fångster som har en grön bakgrund och klicka på redigeringsikonen intill titeln.
3. Prova med att byta till en annan sort fisk och annan vikt.
4. Klicka på **Edit catch**.
5. Nu har fångsten redigerats med uppdatering av teamets totala fångstvikt samt en annan sort av fiskfångst. En notifikation skickas till samtliga som följer eventet.

---

### 10. Testa edit event

**Endast admin av eventet kan ha editmöjligheter.**

1. På ditt egna konto tryck på **Edit event**.
2. Testa med att byt namn på eventet.
3. Avsluta eventet genom att trycka på **End event**.
4. På moa-kontot ska follow-stjärnan vara ifylld.
5. Testa att öppna upp eventet igen genom att gå in på **Edit event** igen och tryck på **Open event**.
6. Prova att ta bort eventet genom att gå in på **Edit event** och sedan välj **Delete event** (observera att detta tar bort all data som hör till detta event som lag, fångstdata, meddelanden).

---
