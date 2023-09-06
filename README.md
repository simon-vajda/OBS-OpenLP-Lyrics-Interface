# OBS-OpenLP plugin távirányító

## OpenLP beállítása

1. OpenLP-ben engedélyezd a `Távirányító felhasználói felület` beállítást.
2. Nyisd meg az OpenLP adatmappát: `Eszközök -> Adatmappa megnyitása`.
3. Hozz létre egy új mappát `stages` néven.
4. Itt hozz létre egy új mappát azzal a névvel, ahogy az új színpadi nézeted hívni szeretnéd. Például `stream`.
5. Másold át az `openlp-stage` mappa tartalmát ebbe az új mappába.

## OBS beállítása

1. OpenLP-ben nyisd meg a `Beállítások -> OpenLP beállítása -> Távirányító felhasználói felület` oldalt. Másold ki a `Színpadi nézet URL-je` címet.
2. Hozz létre egy új `Böngésző` forrást OBS-ben. A webcímhez illeszd be a kimásolt URL-t, és a végére írd oda a színpadi nézeted nevét. (Pl.: `http://192.168.1.7:4316/stage/stream`)
3. A `Dokkok -> Egyéni böngésződokk` menüpontban vegyél föl egy új dokkot tetszőleges névvel és azzal az URL-lel amit a böngésző forrásnál megadtál, kiegészítve azzal, hogy `control.html`. (Pl.: `http://192.168.1.7:4316/stage/stream/control.html`)

## Távirányító beállítása

1. A futtatáshoz Node.JS környezetre van szükség. Ha még nincs telepítve a számítógépeden, akkor innen letöltheted: https://nodejs.org/en.
2. Első indítás előtt telepíteni kell a szükséges könyvtárakat. Ezt az `init.bat` futtatásával megteheted. Erre a későbbiekben nem lesz szükség, a külső fájlokat a `node_modules/` mappába menti a program.
3. Futtatni a `start.bat` elindításával tudod.
4. A távirányító webes felületét a `http://localhost:5000` címen éred el.

## Használat

- Amikor megnyitod az OBS-t, akkor a Böngésző forrás és a Dokk csatlakozni fog az OpenLP-hez és a Távirányítóhoz., ezért fontos, hogy az **OBS-t indítsd el utoljára a 3 program közül!**
- Ha nem fut a távirányító szerver az OBS indításakor, akkor kis időn belül egy figyelmeztető üzenetet jelenít meg erről. A távirányító indítását követően újra kell tölteni a böngésző forrást OBS-ben ahhoz, hogy csatlakozni tudjon. Ezt úgy tudod elvégezni, hogy kijelölöd a böngésző forrást és ennek hatására megjelenik egy `Frissítés` gomb az előnézet alatt. Ezt megnyomva lefrissíti a színpadi nézetet.

## Hasznos beállítások

- Az OBS dokkon sok hasznos beállítás van. Ha azt szeretnéd, hogy dia léptetésnél automatikusan megjelenítse a következő sorokat OBS-ben, akkor pipáld be az `Auto-update text on slide change` opciót.
- Az `Auto-hide when blank screen displayed` bekapcsolását követően pedig szinkronban lesz, hogy amikor elrejted a képernyőt OpenLP-ben, akkor OBS-ben is eltűnik a szöveg.
- A távirányító webes felülethez létrehozhatsz egy Chrome parancsikont. Így külön alkalmazásként fog megjelenni a Start menüben és amikor megnyitod, külön ikonja lesz a tálcán. Ezt úgy érheted el, hogy Chrome-ban amikor megnyitottad az oldalt `Három pont a jobb felső sarokban -> További eszközök -> Parancsikon létrehozása`. Ekkor létrehozza az ikont, viszont még nem saját ablakban nyitja meg az oldalt. Navigálj a `chrome://apps/` linkre, majd jobb klikk a létrehozott parancsikonra és pipáld be a `Megnyitás ablakban` opciót. Ha később eltávolítani szeretnéd a parancsikont, azt is itt tudod megtenni.
