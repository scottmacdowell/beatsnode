package-maker
=============

Automatically generate package.json dependencies by crawling requires

**this is experimental - please comment and contribute!**

### output deps to console

```bash
node index *.js

# {
#   name: 'package-maker',
#   dependencies: {
#      lodash: 'x.x.x',
#      fs: 'x.x.x',
#      detective: 'x.x.x'
#   }
# }
```

### write deps to file

```bash
node index *.js >> package.json
```