#!/usr/bin/env python3
import os
import re
import shutil

base_dir = "/Users/arundurai/Public/SandyWorks/mitos Webapp/admin"

# Step 1: Rename .js files with JSX to .jsx
print("Step 1: Renaming context files...")
for file in ['FormulaFormatter.js', 'TestContext.js', 'useAuth.js']:
    old_path = f"{base_dir}/src/contexts/{file}"
    new_path = f"{base_dir}/src/contexts/{file.replace('.js', '.jsx')}"
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"Renamed: {file} -> {file.replace('.js', '.jsx')}")

# Step 2: Convert function
def convert_nextjs_to_react(content):
    # Remove "use client"
    content = re.sub(r'"use client";\s*\n', '', content)
    content = re.sub(r"'use client';\s*\n", '', content)
    
    # Replace imports
    content = re.sub(r'import\s+{\s*useRouter\s*}\s+from\s+["\']next/navigation["\'];?', 
                    'import { useNavigate } from "react-router-dom";', content)
    content = re.sub(r'import\s+{\s*usePathname\s*}\s+from\s+["\']next/navigation["\'];?',
                    'import { useLocation } from "react-router-dom";', content)
    content = re.sub(r'import\s+{\s*useParams\s*}\s+from\s+["\']next/navigation["\'];?',
                    'import { useParams } from "react-router-dom";', content)
    content = re.sub(r'import\s+Link\s+from\s+["\']next/link["\'];?',
                    'import { Link } from "react-router-dom";', content)
    content = re.sub(r'import\s+Image\s+from\s+["\']next/image["\'];?', '', content)
    
    # Replace router usage
    content = re.sub(r'const\s+router\s*=\s*useRouter\(\);?', 'const navigate = useNavigate();', content)
    content = re.sub(r'const\s+pathname\s*=\s*usePathname\(\);?', 
                    'const location = useLocation();\n  const pathname = location.pathname;', content)
    content = re.sub(r'router\.push\(', 'navigate(', content)
    content = re.sub(r'router\.back\(\)', 'navigate(-1)', content)
    
    # Replace Link href with to
    content = re.sub(r'<Link\s+href=', '<Link to=', content)
    
    # Replace Image with img
    content = re.sub(r'<Image\s+src={([^}]+)}\s+alt={([^}]+)}\s+width={([^}]+)}\s+height={([^}]+)}\s*/?>',
                    r'<img src={\1} alt={\2} width={\3} height={\4} />', content)
    content = re.sub(r'<Image\s+src="([^"]+)"\s+alt="([^"]*)"\s+width={([^}]+)}\s+height={([^}]+)}\s*/?>',
                    r'<img src="\1" alt="\2" width={\3} height={\4} />', content)
    
    return content

# Step 3: Convert all components
print("\nStep 2: Converting components...")
for root, dirs, files in os.walk(f"{base_dir}/src/components"):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            converted = convert_nextjs_to_react(content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(converted)
            print(f"Converted: {file_path}")

# Step 4: Convert all contexts
print("\nStep 3: Converting contexts...")
for file in os.listdir(f"{base_dir}/src/contexts"):
    if file.endswith('.jsx'):
        file_path = f"{base_dir}/src/contexts/{file}"
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        converted = convert_nextjs_to_react(content)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(converted)
        print(f"Converted: {file_path}")

print("\nConversion complete!")
