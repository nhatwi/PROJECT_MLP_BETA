import sys

def check_brackets(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    open_brackets = set(pairs.values())
    close_brackets = set(pairs.keys())

    i = 0
    n = len(code)
    line = 1
    col = 1

    template_depth = [] # track curly brace depths inside template literals

    while i < n:
        c = code[i]
        
        # Line/col tracking
        if c == '\n':
            line += 1
            col = 1
        else:
            col += 1

        # Check line comments
        if c == '/' and i + 1 < n and code[i + 1] == '/':
            i += 2
            while i < n and code[i] != '\n':
                i += 1
            continue

        # Check block comments
        if c == '/' and i + 1 < n and code[i + 1] == '*':
            i += 2
            while i + 1 < n and not (code[i] == '*' and code[i + 1] == '/'):
                if code[i] == '\n':
                    line += 1
                    col = 1
                else:
                    col += 1
                i += 1
            i += 2
            continue

        # Check single/double quote strings
        if c in ('"', "'"):
            quote = c
            q_line, q_col = line, col
            i += 1
            while i < n and code[i] != quote:
                if code[i] == '\\':
                    i += 2
                else:
                    if code[i] == '\n':
                        line += 1
                        col = 1
                    else:
                        col += 1
                    i += 1
            if i >= n:
                print(f"Unclosed string starting at line {q_line}, col {q_col}")
                return False
            i += 1
            continue

        # Check template strings `...`
        if c == '`':
            t_line, t_col = line, col
            i += 1
            while i < n:
                if code[i] == '\\':
                    i += 2
                elif code[i] == '`':
                    i += 1
                    break
                elif code[i] == '$' and i + 1 < n and code[i + 1] == '{':
                    # Interpolation inside template string
                    stack.append(('${', line, col))
                    template_depth.append(len(stack))
                    i += 2
                    break
                else:
                    if code[i] == '\n':
                        line += 1
                        col = 1
                    else:
                        col += 1
                    i += 1
            continue

        # Check opening brackets
        if c in open_brackets:
            stack.append((c, line, col))
            i += 1
            continue

        # Check closing brackets
        if c in close_brackets:
            if not stack:
                print(f"Unmatched closing bracket '{c}' at line {line}, col {col}")
                return False
            top, top_line, top_col = stack.pop()
            
            # Check if this closes a template interpolation ${ ... }
            if c == '}' and top == '${':
                # Resume parsing template string!
                i += 1
                while i < n:
                    if code[i] == '\\':
                        i += 2
                    elif code[i] == '`':
                        i += 1
                        break
                    elif code[i] == '$' and i + 1 < n and code[i + 1] == '{':
                        stack.append(('${', line, col))
                        template_depth.append(len(stack))
                        i += 2
                        break
                    else:
                        if code[i] == '\n':
                            line += 1
                            col = 1
                        else:
                            col += 1
                        i += 1
                continue

            if pairs[c] != top:
                print(f"Mismatched bracket '{c}' at line {line}, col {col} (expected match for '{top}' from line {top_line}, col {top_col})")
                return False
            i += 1
            continue

        i += 1

    if stack:
        for b, l, col in stack:
            print(f"Unclosed opening bracket '{b}' from line {l}, col {col}")
        return False

    print("All brackets, parentheses, and braces are perfectly balanced!")
    return True

if __name__ == '__main__':
    target = 'app.js' if len(sys.argv) < 2 else sys.argv[1]
    success = check_brackets(target)
    sys.exit(0 if success else 1)
