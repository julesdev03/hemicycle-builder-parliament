# hemycicle-builder_parliament
Build a parliament based on the number of members, you can fully personalize the behaviour of such builder as it is easily understandable.

**How does it work?**

Build a hemycicle by providing as data a list of objects containing the following {'fill':'color_in_which_to_fill_the_dot'}. The data will be displayed from left to right.

You can easily personalized the way dots behave, and extend the amount of data to be provided by modifying the drawPointHemycicle(data), the sorting algorithms will remain the same.

**Adding to the DOM and sizing**

You can then display the svg by using getElement() and adding the svg element to the DOM. The SVG element will set its own size in order to make all dots fit. However, you can still resize it in CSS if necessary in order to keep the proportions.
