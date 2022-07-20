start /b openocd.exe -f im100-builtin.cfg 
ping -n 4 127.0.0.1>nul
::cls
riscv32-unknown-elf-gdb.exe test -x elf_dbg.gdb
@@taskkill /f /t /im openocd.exe > nul