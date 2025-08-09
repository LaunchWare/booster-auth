# CLAUDE.md

This is an open source, Node and React-based library that is meant to be used as an exploration in AI assisted coding.

It uses a central `./brain` directory that should be considered the main source of project context.

## Writing Markdown

When writing markdown, please use the following conventions:

- Use headings (`#`, `##`, `###`) to organize content hierarchically.
- Use bullet points for lists and keep them concise.
- Use code blocks (```) for code snippets and examples. Be sure to include the language for syntax highlighting.
- Use links to reference other documents or resources.
- Adhere to prettier markdown rules for formatting consistency.

## Key Files

- `brain/architectural-context.md`: Describes the overall architecture of the system.
- `brain/library-prd.md`: Contains product requirements for the library.
- `brain/epics/`: Directory containing epic specifications.
- `brain/user-stories/`: Directory containing user story specifications.
- `brain/active-context.md`: It tracks what you are doing right now and what's next.

## Testing Conventions

When writing tests, use assertive language in test descriptions:
- Use `it('returns a ZodString type')` instead of `it('should return ZodString type')`
- Use `it('validates password length')` instead of `it('should validate password length')`  
- Use `it('throws an error when invalid')` instead of `it('should throw an error when invalid')`

Tests describe what the code does, not what it should do.
