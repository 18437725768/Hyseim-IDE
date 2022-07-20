start /b openocd.exe -d1 -f im100-builtin.cfg
ping -n 4 127.0.0.1>nul
::cls
riscv32-unknown-elf-gdb.exe -q flash_tool -x elf_flash.gdb
@echo ---Write flash finished!---
@@taskkill /f /t /im openocd.exe > nul
