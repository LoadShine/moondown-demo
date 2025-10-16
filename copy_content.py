# 遍历src目录及其子目录下所有的.tsx, .ts文件，将其内容依次拷贝到source_code.md文件中。
# 每两个文件间隔2个空行
import os
import shutil
import re
import sys
import time

def copy_content():
    # Check if the source directory exists
    src_dir = './src'
    if not os.path.exists(src_dir):
        print(f"Source directory '{src_dir}' does not exist.")
        return

    # Create or clear the destination file
    dest_file = './source_code.md'
    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write("")  # Clear the file

    # Walk through the source directory and its subdirectories
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            # if file.endswith('.tsx'):
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css') or file.endswith('.json'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Write the content to the destination file
                    with open(dest_file, 'a', encoding='utf-8') as dest_f:
                        dest_f.write(content + "\n\n")
                print(f"Copied content from '{file_path}' to '{dest_file}'")
                time.sleep(0.1)

    # add tailwind.config.ts
    tailwind_config_path = './tailwind.config.ts'
    if os.path.exists(tailwind_config_path):
        with open(tailwind_config_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Write the content to the destination file
            with open(dest_file, 'a', encoding='utf-8') as dest_f:
                dest_f.write(content + "\n\n")
        print(f"Copied content from '{tailwind_config_path}' to '{dest_file}'")
    print(f"All contents copied to '{dest_file}'")


if __name__ == "__main__":
    copy_content()
