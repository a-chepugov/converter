#!/bin/sh
magick ../input/0.gif -strip \
\( +clone \
-resize '%[fx:w>=h?800:600]x%[fx:w>=h?600:800]' \
-rotate 90 \
-gravity NorthEast -background none -fill '#ffffffB0' -pointsize 150 -font ../static/dixiland_mio.ttf -annotate 0x0+44-33 i \
\( example.gif -gravity SouthWest -rotate -15 -resize 150% -geometry +25+25 \) -composite \
-quality 70 -unsharp 0.6x0.6+1+0.05 -interlace partition -colorspace RGB \
-write ../output/0fx.jpg +delete \
\) \
-resize '%[fx:w>=h?1600:1200]x%[fx:w>=h?1200:1600]>' -colorspace RGB ../output/0.jpeg
