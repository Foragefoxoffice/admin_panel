#!/usr/bin/env python3
import os
import re
import shutil

base_dir = "/Users/arundurai/Public/SandyWorks/mitos Webapp/admin"
src_app = f"{base_dir}/src/app"
dest_pages = f"{base_dir}/src/pages"

# Pages to convert
pages = [
    ("login/page.jsx", "Login.jsx"),
    ("register/page.jsx", "Register.jsx"),
    ("test/page.jsx", "Test.jsx"),
    ("admin/user/page.jsx", "admin/UserList.jsx"),
    ("admin/user/[id]/page.jsx", "admin/UserDetail.jsx"),
    ("admin/banners/page.jsx", "admin/Banners.jsx"),
    ("admin/addbanners/page.jsx", "admin/AddBanners.jsx"),
    ("admin/news/page.jsx", "admin/News.jsx"),
    ("admin/news/[id]/page.jsx", "admin/NewsDetail.jsx"),
    ("admin/news/edit/[id]/page.jsx", "admin/NewsEdit.jsx"),
    ("admin/addnews/page.jsx", "admin/AddNews.jsx"),
    ("admin/materials/page.jsx", "admin/Materials.jsx"),
    ("admin/material-upload/page.jsx", "admin/MaterialUpload.jsx"),
    ("admin/blocks/page.jsx", "admin/Blocks.jsx"),
    ("admin/types/page.jsx", "admin/Types.jsx"),
    ("admin/upload/page.jsx", "admin/Upload.jsx"),
    ("admin/edit/page.jsx", "admin/Edit.jsx"),
    ("admin/question/page.jsx", "admin/Question.jsx"),
    ("admin/questions/page.jsx", "admin/Questions.jsx"),
    ("admin/reports/page.jsx", "admin/Reports.jsx"),
    ("admin/export/page.jsx", "admin/Export.jsx"),
    ("admin/pdf/page.jsx", "admin/Pdf.jsx"),
    ("admin/pdf-premium/page.jsx", "admin/PdfPremium.jsx"),
]

def convert_page(content):
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
    content = re.sub(r'<a\s+href="/([^"]+)"', r'<Link to="/\1"', content)
    content = re.sub(r'</a>', '</Link>', content)
    
    # Replace Image with img
    content = re.sub(r'<Image\s+src={([^}]+)}\s+alt={([^}]+)}\s+width={([^}]+)}\s+height={([^}]+)}\s*/?>',
                    r'<img src={\1} alt={\2} width={\3} height={\4} />', content)
    content = re.sub(r'<Image\s+src="([^"]+)"\s+alt="([^"]*)"\s+width={([^}]+)}\s+height={([^}]+)}\s*/?>',
                    r'<img src="\1" alt="\2" width={\3} height={\4} />', content)
    
    return content

# Convert pages
os.makedirs(f"{dest_pages}/admin", exist_ok=True)

for source_path, dest_path in pages:
    source_file = os.path.join(src_app, source_path)
    dest_file = os.path.join(dest_pages, dest_path)
    
    os.makedirs(os.path.dirname(dest_file), exist_ok=True)
    
    if os.path.exists(source_file):
        with open(source_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        converted_content = convert_page(content)
        
        with open(dest_file, 'w', encoding='utf-8') as f:
            f.write(converted_content)
        
        print(f"Converted: {source_path} -> {dest_path}")

print("\nPage conversion complete!")
