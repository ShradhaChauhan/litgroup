import os

root_dir = r"c:\Users\shrad\OneDrive\Desktop\litGroup"

def update_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Calculate relative path to root to determine prefix for links
        # e.g. root/about/index.html -> ..
        # root/index.html -> .
        rel_path = os.path.relpath(file_path, root_dir)
        depth = len(rel_path.split(os.sep)) - 1
        prefix = "../" * depth if depth > 0 else ""
        
        # 1. Add mobile-enhancements.css if missing
        if "mobile-enhancements.css" not in content:
            # Look for style.css to insert after
            if "style.css" in content:
                # Insert after the line containing style.css
                lines = content.splitlines()
                for i, line in enumerate(lines):
                    if "style.css" in line:
                        indent = line[:len(line) - len(line.strip())]
                        new_link = f'{indent}<link rel="stylesheet" href="{prefix}mobile-enhancements.css" />'
                        lines.insert(i + 1, new_link)
                        content = "\n".join(lines)
                        break
        
        # 2. Fix Footer Power Supply Link
        # Pattern 1: <a href="#" class="power-solutions-link">Power Solutions</a>
        # Pattern 2: Existing link but maybe wrong text or href
        # We want: <li><a href="{prefix}power-supply/">Power Supply</a></li>
        
        # Replace the specific "Power Solutions" placeholder I saw in about/index.html
        target_str = '<a href="#" class="power-solutions-link">Power Solutions</a>'
        replacement = f'<a href="{prefix}power-supply/">Power Supply</a>'
        
        if target_str in content:
           content = content.replace(target_str, replacement)
           
        # Also check for variations if necessary, but start with this.
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
        else:
            print(f"No changes needed: {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".html"):
            update_file(os.path.join(root, file))
