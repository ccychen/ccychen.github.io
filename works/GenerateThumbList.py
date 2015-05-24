import sys, os, os.path
import struct
import imghdr

    
def get_image_size(fname):
    '''Determine the image type of fhandle and return its size.
    from draco'''
    fhandle = open(fname, 'rb')
    head = fhandle.read(24)
    if len(head) != 24:
        return
    if imghdr.what(fname) == 'png':
        check = struct.unpack('>i', head[4:8])[0]
        if check != 0x0d0a1a0a:
            return
        width, height = struct.unpack('>ii', head[16:24])
    elif imghdr.what(fname) == 'gif':
        width, height = struct.unpack('<HH', head[6:10])
    elif imghdr.what(fname) == 'jpeg':
        try:
            fhandle.seek(0) # Read 0xff next
            size = 2
            ftype = 0
            while not 0xc0 <= ftype <= 0xcf:
                fhandle.seek(size, 1)
                byte = fhandle.read(1)
                while ord(byte) == 0xff:
                    byte = fhandle.read(1)
                ftype = ord(byte)
                size = struct.unpack('>H', fhandle.read(2))[0] - 2
            # We are at a SOFn block
            fhandle.seek(1, 1)  # Skip `precision' byte.
            height, width = struct.unpack('>HH', fhandle.read(4))
        except Exception: #IGNORE:W0703
            return
    else:
        return
    return width, height

file_object = open('list.js', 'w')
file_object.write("var FILE_LIST = [\n")

isFirst = 1
files = [f for f in os.listdir(".\\thumb")]
for f in files:
    fName = f.lower()
    fPath = ".\\thumb\\" + fName
    if os.path.isfile(fPath) and (f.endswith('jpg') or f.endswith('jpeg') or f.endswith('png')):
        if isFirst != 1:
            file_object.write(",\n")
        isFirst = 0
        size = get_image_size(fPath)
        l = "[\"" + f + "\"," + str(size[0]) + "," + str(size[1]) + "]"
        print(l)
        file_object.write(l)
        
file_object.write("\n];")
