with open('next.config.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'const nextConfig = {' in line:
        new_lines.append(line)
        new_lines.append('  output: "standalone",\n')
    else:
        new_lines.append(line)

with open('next.config.ts', 'w') as f:
    f.writelines(new_lines)
