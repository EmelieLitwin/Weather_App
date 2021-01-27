Sammanfattning 

Syftet med detta projekt var att utveckla och testa en fungerande väderprognosapplikation som integrerar uppdaterad väderdata från ett REST-API, med hjälp av inmatad data från användaren. Denna applikation skulle dessutom levereras som en hemsida med en registrering- och inloggningsfunktion som var säkrad.

För registrering och inloggning användes MongoDB som databas och Bcrypt för att hasha lösenorden. För vädersidan användes ett API från OpenWeatherMap för att skapa en femdygnsprognos med sex inhämtade variabler: väderikon, beskrivning, temperatur, vindhastighet, luftfuktighet och nederbörd. Vid första hämtning av sidan får användaren en prognos för Stockholm, men har också möjligheten att söka på en stad.

Applikationen testades med två verktyg: Vega och Wireshark. Vega gjorde en automatiserad skanning för att identifiera säkerhetsrisker och Wireshark användes för att analysera nätverkstrafiken under interaktion med sidan. En riskanalys gjordes även med hjälp av Common Vulnerability Scoring System (CVSS).

Analys av Wireshark-, Vega- och CVSS-resultaten visar att den största säkerhetsrisken i vår applikation var användningen av HTTP som kommunikationsprotokoll mellan browsern och servern. Detta blottade allt datautbyte mellan dessa två ändpunkter och gjorde känslig information som inloggningsuppgifter och API-nycklar synlig när nätverkstrafik skannades. Dessutom presenterade inloggningsformuläret samt sökrutan på vädersidan egna risker eftersom de saknade säkrade inmatningsfält. 

Implementering av HTTPS-protokollen skulle vara det viktigaste nästa steget i utveckling av applikationen. Kryptering of applikationens kommunikation stärker skyddet mot avlyssning av nätverkstrafik och möjliggör mer lämplig överföring av känslig information. Eftersom interaktionen mellan användaren och applikationen består mestadels av formulär, måste även skydd mot kodinjektion prioriteras. 
