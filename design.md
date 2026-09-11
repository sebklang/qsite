Hierarki:

- /
    - Visar användarens besökta köer och låter användaren skapa sin egen kö. Visar "no visited rooms" annars för att indikera att det är en feature.
    - /create
        - **Om inloggad:** Låt användaren välja mellan att skapa ett namn för rummet eller autogenerera ett namn.
        - **Om inte inloggad:** Fråga användaren att logga in med Google eller Github sign-in eller att skapa sitt eget konto.
    - /[roomname]
        - **Alla användare:** Kan skapa en ny request
            - En request består av ett obligatoriskt namn/gruppnummer/plats och en valfri kommentar/fråga.
            - Varje användare kan avbryta sina egna requests (eller markera som färdiga).
        - **Om användaren skapade rummet:**
            - Kan avbryta eller markera alla requests som färdiga.
            - Kan ta bort rummet.
