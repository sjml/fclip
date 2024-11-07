# `fclip`

Takes whatever is in your clipboard and formats it with `prettier`. 

### Example
1. Copy some jankily formatted JSON from someplace. 
2. `fclip json`
3. Paste your nicely formatted JSON wherever you want. 

I used to have [a little shell script that did this](https://github.com/sjml/dotfiles/blob/d100dee9f920a888054acdf48ae9f3053a8174b3/bin.homelink/fclip) but [prettier seems pretty devoted to making themselves useless if installed globally](https://github.com/prettier/prettier/issues/15141). So I made a little script with Deno which compiles to an absurdly large (but portable) executable. 

Only works on Macs because that's what I use and it leverages the built-in `pbcopy` and `pbpaste` utilities instead of doing any fancy kind of API work. 

Enjoy. Or don't, whatever. It's useful to me. 

