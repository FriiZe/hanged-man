# Database schema

```mermaid
graph TD;
  User;
  Player;
  Room;
  Game;
  History;

  Player --> User;
  Player --> History;

  Room --> Player;
  Room --> Player;
  Room --> Game;

  History --> Game;
  History --> Game;
```
