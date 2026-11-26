import re
import os

input_path = r'c:\Users\ashya\Downloads\arogyatrack\ArogyaTrack_Final_Project_Report.md'
output_path = r'c:\Users\ashya\Downloads\arogyatrack\ArogyaTrack_Final_Project_Report.html'

with open(input_path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
html_lines = []
in_table = False
in_code = False

css = """
<style>
  @page {
    size: A4 portrait;
    margin: 25mm 25mm 25mm 38mm;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #111;
    max-width: 860px;
    margin: 0 auto;
    padding: 30px;
    text-align: justify;
    background: #fff;
  }
  h1 {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-top: 30pt;
    margin-bottom: 15pt;
    page-break-before: always;
  }
  h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 22pt;
    margin-bottom: 10pt;
  }
  h3 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 16pt;
    margin-bottom: 6pt;
  }
  p {
    margin-top: 0;
    margin-bottom: 6pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 10pt;
  }
  th, td {
    border: 1px solid #333;
    padding: 6pt 8pt;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  pre {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    padding: 10pt;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    overflow-x: auto;
    line-height: 1.35;
    white-space: pre-wrap;
  }
  hr {
    margin: 25pt 0;
    border: 0;
    border-top: 1px solid #ccc;
  }
  .print-bar {
    position: sticky;
    top: 0;
    background: #0d6efd;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    z-index: 1000;
  }
  .print-bar button {
    background: #fff;
    color: #0d6efd;
    border: none;
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  @media print {
    .print-bar { display: none; }
    body { padding: 0; max-width: 100%; }
  }
</style>
"""

html_lines.append("<!DOCTYPE html>\n<html lang='en'>\n<head>\n<meta charset='utf-8'>\n<title>ArogyaTrack Final Project Report</title>" + css + "</head>\n<body>\n")
html_lines.append("<div class='print-bar'><span><strong>KL University Capstone Final Project Report (Cluster A)</strong></span><button onclick='window.print()'>📥 Print / Save as PDF (Ctrl + P)</button></div>\n")

for line in lines:
    s = line.strip()
    if s.startswith('```'):
        if in_code:
            html_lines.append('</pre>\n')
            in_code = False
        else:
            html_lines.append('<pre>')
            in_code = True
        continue

    if in_code:
        html_lines.append(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;') + '\n')
        continue

    # Tables
    if '|' in line and s.startswith('|') and s.endswith('|'):
        parts = [p.strip() for p in s[1:-1].split('|')]
        if all(re.match(r'^:?-+:?$', p) for p in parts if p):
            continue
        if not in_table:
            in_table = True
            html_lines.append('<table>\n<thead><tr>' + ''.join(f'<th>{p}</th>' for p in parts) + '</tr></thead>\n<tbody>\n')
        else:
            html_lines.append('<tr>' + ''.join(f'<td>{p}</td>' for p in parts) + '</tr>\n')
        continue
    else:
        if in_table:
            html_lines.append('</tbody>\n</table>\n')
            in_table = False

    if s == '\\newpage' or s == '---':
        html_lines.append('<hr>\n')
    elif s.startswith('# '):
        html_lines.append(f'<h1>{s[2:].strip()}</h1>\n')
    elif s.startswith('## '):
        html_lines.append(f'<h2>{s[3:].strip()}</h2>\n')
    elif s.startswith('### '):
        html_lines.append(f'<h3>{s[4:].strip()}</h3>\n')
    elif s.startswith('* ') or s.startswith('- '):
        html_lines.append(f'<li>{s[2:].strip()}</li>\n')
    elif s:
        formatted = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', s)
        formatted = re.sub(r'\*(.*?)\*', r'<em>\1</em>', formatted)
        html_lines.append(f'<p>{formatted}</p>\n')

if in_table:
    html_lines.append('</tbody>\n</table>\n')

html_lines.append('</body>\n</html>')

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(''.join(html_lines))

print('SUCCESS')
