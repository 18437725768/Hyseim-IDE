start /b openocd.exe -d1 -f im100-builtin.cfg 
ping -n 4 127.0.0.1>nul
::cls
start /b riscv32-unknown-elf-gdb.exe -q test -x elf_run.gdb
ping -n 6 127.0.0.1>nul
@@taskkill /f /t /im riscv32-unknown-elf-gdb.exe > nul
@@taskkill /f /t /im openocd.exe > nul