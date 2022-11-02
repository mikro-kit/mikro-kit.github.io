# mikro-kit.github.io
## neue Projekte anlegen

Die Dateien Template.md befinden sich im Ordner **_projects**


```
mikro-kit.github.io
|- _articles
|- ...
|- _projects
  |- de
    |- amour.md
    |- ...
    |- TEMPLATE.md
    |- ...
  |- fr
    |- amour.md
    |- ...
    |- TEMPLATE.md
    |- ...
```

1. TEMPLATE.md kopieren und entsprechend umbenennen
2. [Front Matter](https://jekyllrb.com/docs/front-matter/) bearbeiten (title, subtitle, ref, image, etc.) und Inhalte einstellen
3. Bilder in die ensprechenden Formaten bringen und den im [Front Matter](https://jekyllrb.com/docs/front-matter/) angegeben Namen abspeichern.
~~4. Bilder einfügen unter `assets/images/projects/<ref aus dem Projekt>`~~~
4. Bilder bei Contentful hochladen über die Content-API die Image-URL bekommen und im Front-Matter einfügen
5. Alles da? Dann in der Projektseite die letzte Zeile im Front Matter (`published: FALSE`) löschen.
