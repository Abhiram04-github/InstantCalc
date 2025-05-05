const MATH_PATTERN = /=\(((?:[^()]|\([^()]*\))*)\)/g;

class InstantCalc {
    constructor() {
        this.observer = new MutationObserver(this.handleMutations.bind(this));
        this.init();
    }

    init() {
        this.observeDocument();
        document.addEventListener('input', this.handleInput.bind(this));
    }

    handleInput(e) {
        if (this.isEditable(e.target)) {
            this.processElement(e.target);
        }
    }

    handleMutations(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    this.processNode(node);
                }
            });
        });
    }

    processNode(node) {
        const elements = node.querySelectorAll('input, textarea, [contenteditable="true"]');
        elements.forEach(el => this.processElement(el));
    }

    isEditable(element) {
        return element.matches('input, textarea, [contenteditable="true"]');
    }

    observeDocument() {
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    processElement(element) {
        const isContentEditable = element.isContentEditable;
        let originalValue, selectionStart, selectionEnd;

        if (isContentEditable) {
            originalValue = element.innerText;
            const selection = this.getContentEditableSelection(element);
            selectionStart = selection.start;
            selectionEnd = selection.end;
        } else {
            originalValue = element.value;
            selectionStart = element.selectionStart;
            selectionEnd = element.selectionEnd;
        }

        let newValue = originalValue;
        const matches = [...originalValue.matchAll(MATH_PATTERN)].reverse();

        let newCursorPos = selectionStart;
        let newSelectionEnd = selectionEnd;

        for (const match of matches) {
            const fullMatch = match[0];
            const expr = match[1];
            const start = match.index;
            const end = start + fullMatch.length;
            const replacement = this.evaluateExpression(expr);

            newValue = newValue.slice(0, start) + replacement + newValue.slice(end);
            const lengthDiff = replacement.length - fullMatch.length;

            // Adjust cursor positions
            if (newCursorPos > end) {
                newCursorPos += lengthDiff;
            } else if (newCursorPos >= start) {
                newCursorPos = start + replacement.length;
            }

            if (newSelectionEnd > end) {
                newSelectionEnd += lengthDiff;
            } else if (newSelectionEnd >= start) {
                newSelectionEnd = start + replacement.length;
            }
        }

        if (newValue !== originalValue) {
            this.updateElement(
                element,
                newValue,
                Math.max(0, newCursorPos),
                Math.max(0, newSelectionEnd)
            );
        }
    }

    getContentEditableSelection(element) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return { start: 0, end: 0 };
        
        const range = sel.getRangeAt(0);
        if (!element.contains(range.startContainer)) return { start: 0, end: 0 };
        
        const tempRange = document.createRange();
        tempRange.selectNodeContents(element);
        
        try {
            tempRange.setEnd(range.startContainer, range.startOffset);
            const start = tempRange.toString().length;
            
            tempRange.setEnd(range.endContainer, range.endOffset);
            const end = tempRange.toString().length;
            
            return { start, end };
        } catch (e) {
            return { start: 0, end: 0 };
        }
    }

    evaluateExpression(expr) {
        try {
            const resolved = this.resolveNested(expr);
            const sanitized = this.sanitizeInput(resolved);
            return this.safeEval(sanitized);
        } catch (e) {
            return 'ERROR';
        }
    }

    resolveNested(expr) {
        return expr.replace(MATH_PATTERN, (_, innerExpr) => {
            return this.evaluateExpression(innerExpr);
        });
    }

    sanitizeInput(expr) {
        return expr
            .replace(/[^\d%\/*+\-().]/g, '')
            .replace(/(\d)%/g, '$1/100')
            .replace(/([+\-*/])(?=[+\-*/])/g, '');
    }

    safeEval(expr) {
        try {
            const tokens = this.tokenize(expr);
            const postfix = this.infixToPostfix(tokens);
            const result = this.evaluatePostfix(postfix);
            return this.formatResult(result);
        } catch (e) {
            return 'ERROR';
        }
    }

    tokenize(expr) {
        const tokenRegex = /(\d+\.?\d*|\.\d+)|([+\-*/%^()])/g;
        const tokens = [];
        let match;

        while ((match = tokenRegex.exec(expr))) {
            if (match[1]) {
                tokens.push({ type: 'number', value: parseFloat(match[1]) });
            } else if (match[2]) {
                tokens.push({ type: 'operator', value: match[2] });
            }
        }
        return tokens;
    }

    infixToPostfix(tokens) {
        const output = [];
        const stack = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };

        tokens.forEach(token => {
            if (token.type === 'number') {
                output.push(token);
            } else if (token.value === '(') {
                stack.push(token);
            } else if (token.value === ')') {
                while (stack.length && stack[stack.length - 1].value !== '(') {
                    output.push(stack.pop());
                }
                stack.pop();
            } else {
                while (stack.length && precedence[stack[stack.length - 1].value] >= precedence[token.value]) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }
        });

        return output.concat(stack.reverse());
    }

    evaluatePostfix(postfix) {
        const stack = [];
        postfix.forEach(token => {
            if (token.type === 'number') {
                stack.push(token.value);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                switch (token.value) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': stack.push(a / b); break;
                    case '%': stack.push(a % b); break;
                }
            }
        });
        return stack[0];
    }

    formatResult(number) {
        if (typeof number !== 'number') return 'ERROR';
        return Number.isInteger(number) ?
            number.toString() :
            number.toFixed(2).replace(/\.?0+$/, '');
    }

    updateElement(element, newValue, selectionStart, selectionEnd) {
        const isContentEditable = element.isContentEditable;

        if (isContentEditable) {
            element.innerText = newValue;
            this.setCaretPosition(element, selectionStart, selectionEnd);
        } else {
            element.value = newValue;
            element.setSelectionRange(selectionStart, selectionEnd);
        }
    }

    setCaretPosition(element, start, end) {
        const range = document.createRange();
        const sel = window.getSelection();
        const textNode = element.childNodes[0] || document.createTextNode('');

        if (!element.childNodes.length) element.appendChild(textNode);

        end = end || start;
        range.setStart(textNode, Math.min(start, textNode.length));
        range.setEnd(textNode, Math.min(end, textNode.length));
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

new InstantCalc();