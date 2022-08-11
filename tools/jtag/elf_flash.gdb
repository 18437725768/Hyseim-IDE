target extended-remote:3333
monitor reset halt
monitor adapter speed     100
load
b main
continue
restore flash.bin binary 0x1C020000
#monitor adapter speed     1000
b __rt_deinit
continue
echo flash OK!\nq
quit
