import json
import os

title= {"cn":"Runistar2021-cn","en":"Runistar2021-en","fr":"Runistar2021-fr"}
rootPath = f"D:\\Works\\Clients\\CCY\\ccychen.github.io\\"
imgRelativePath = f"/03Runïstar2021/"
outputFile = rootPath + f"preview\\art\\Runistar2021.html"

def getContent(imgPath):
    content=""
    if(not os.path.isdir(imgPath)):
        return content
    
    imgs = os.listdir(imgPath)

    for img in imgs:
        if("cover" in img.lower()):
            continue

        print(img)
        content += f'''<div class="pic col-md-8 col-offset-md-2 col-sm-12"><img src="{imgRelativePath}{img}"><ul class="tags"></ul></div>\n'''           
    return content

# Read HTML template
with open('littlestuff-template.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Replace title
template = template.replace('%%title-en%%', title["en"])
template = template.replace('%%title-cn%%', title["cn"])
template = template.replace('%%title-fr%%', title["fr"])

# Generate content section
content = getContent(rootPath + imgRelativePath)

if content and len(content) > 0:
    template = template.replace('%%content%%', content)

    # Write new HTML file
    with open(outputFile, 'w', encoding='utf-8') as f:
        f.write(template)
    print(f"Generated {outputFile} successfully!")
else:
    print(f"Failed to generate file")


