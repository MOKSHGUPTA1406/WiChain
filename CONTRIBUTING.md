# Contributing to Wi-Chain Portal

Thank you for your interest in contributing to Wi-Chain Portal! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 **Report Bugs**: Submit detailed bug reports
- 💡 **Suggest Features**: Propose new features or improvements
- 📝 **Improve Documentation**: Fix typos, add examples, clarify instructions
- 💻 **Submit Code**: Fix bugs, implement features, optimize performance
- 🎨 **Design**: Improve UI/UX, create mockups
- 🧪 **Testing**: Write tests, perform QA

## 📋 Before You Start

### Prerequisites
- Node.js 18+ and npm
- Rust (latest stable) for WASM development
- Git for version control
- Familiarity with React, TypeScript, and Rust (depending on contribution area)

### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/wichain-portal.git
cd wichain-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔄 Development Workflow

### 1. Create a Branch
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `perf/` - Performance improvements

### 2. Make Your Changes

#### Frontend Development
```bash
# Edit files in src/app/components/
# Changes hot-reload automatically

# Follow the component structure:
# - Keep components small and focused
# - Use TypeScript types
# - Follow existing naming conventions
```

#### WASM Development
```bash
# Create or modify applets in applets/
cd applets/example-applet

# Make changes to src/lib.rs

# Build and test
cargo build --target wasm32-unknown-unknown --release
cargo test
```

### 3. Code Style Guidelines

#### TypeScript/React
```typescript
// ✅ Good
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  return <div onClick={onAction}>{title}</div>;
}

// ❌ Avoid
export function Component(props: any) {
  return <div onClick={props.onAction}>{props.title}</div>;
}
```

#### Rust
```rust
// ✅ Good
#[no_mangle]
pub extern "C" fn my_function(param: u64) -> i32 {
    // Clear, documented function
    0
}

// ❌ Avoid
pub extern fn func(p: u64) -> i32 { 0 }
```

### 4. Write Tests

#### Frontend Tests (Future)
```typescript
import { render, screen } from '@testing-library/react';
import { AppletCard } from './AppletCard';

test('renders applet card with name', () => {
  render(<AppletCard applet={mockApplet} onInvoke={jest.fn()} />);
  expect(screen.getByText('AI Model Training')).toBeInTheDocument();
});
```

#### WASM Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_invoke_service() {
        let data = b"test_data";
        let result = invoke_service(data.as_ptr(), data.len());
        assert_eq!(result, 0);
    }
}
```

### 5. Commit Your Changes

#### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

#### Examples
```bash
# Good commit messages
git commit -m "feat(applet-card): add gas cost display"
git commit -m "fix(wallet): handle connection timeout"
git commit -m "docs(readme): update setup instructions"

# Detailed commit
git commit -m "feat(htlc): implement atomic swap logic

- Add lock_funds function with timeout
- Add claim_funds with preimage verification
- Include comprehensive tests

Closes #123"
```

### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
# Fill out the PR template with:
# - Clear description of changes
# - Screenshots (for UI changes)
# - Testing steps
# - Related issues
```

## 📝 Pull Request Guidelines

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Builds successfully (`npm run build`)
- [ ] All tests pass (`make test`)
- [ ] PR description is clear and complete
- [ ] Branch is up to date with main

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Screenshots (if applicable)
[Add screenshots here]

## Testing Steps
1. Step 1
2. Step 2
3. Expected result

## Related Issues
Closes #123
```

## 🐛 Reporting Bugs

### Before Reporting
1. Check existing issues
2. Verify it's reproducible
3. Test on latest version

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature related to a problem?**
Description of the problem

**Describe the solution**
Clear description of desired feature

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, references
```

## 🎨 UI/UX Contributions

### Design Guidelines
- Follow Wi-Chain color palette (neon green #00ff88)
- Maintain dark mode aesthetic
- Ensure accessibility (WCAG 2.1 AA)
- Keep designs responsive
- Use existing component patterns

### Submitting Designs
1. Create mockups (Figma preferred)
2. Share design file/link
3. Explain design decisions
4. Consider implementation feasibility

## 📚 Documentation Contributions

### Documentation Standards
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep formatting consistent
- Update table of contents

### Files to Update
- `README.md` - Main project info
- `SETUP_GUIDE.md` - Setup instructions
- `API_REFERENCE.md` - API docs
- `ARCHITECTURE.md` - System design
- Component JSDoc comments

## 🧪 Testing Guidelines

### What to Test
- New features and bug fixes
- Edge cases and error conditions
- Cross-browser compatibility
- Mobile responsiveness
- Performance regressions

### Running Tests
```bash
# Frontend tests (when implemented)
npm test

# WASM tests
cd applets/example-applet
cargo test

# Integration tests (future)
npm run test:e2e
```

## 🔍 Code Review Process

### What We Look For
1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it clean and maintainable?
3. **Performance**: Is it efficient?
4. **Security**: Are there vulnerabilities?
5. **Documentation**: Is it well-documented?

### Review Timeline
- Initial review: Within 2-3 days
- Follow-up: Within 1-2 days
- Merge: After approval from 1+ maintainers

## 🏆 Recognition

### Contributors
All contributors are recognized in:
- GitHub contributors page
- Release notes
- Project README (for significant contributions)

### Becoming a Maintainer
Criteria:
- Consistent, quality contributions
- Deep understanding of codebase
- Helpful in reviews and discussions
- Alignment with project goals

## 📞 Getting Help

### Where to Ask
- **GitHub Discussions**: General questions
- **Discord**: Real-time chat (#dev channel)
- **Issues**: Bug-specific questions
- **Email**: For sensitive matters

### Response Times
- Discord: Usually within hours
- GitHub: Within 1-2 days
- Email: Within 3-5 days

## 🚫 What Not to Do

- ❌ Submit PRs without discussion for major changes
- ❌ Copy code without proper attribution
- ❌ Ignore code review feedback
- ❌ Push directly to main branch
- ❌ Include unrelated changes in PR
- ❌ Submit incomplete work
- ❌ Violate code of conduct

## 📜 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- Be respectful and inclusive
- Give and accept constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

### Enforcement
Violations will result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: conduct@weilchain.io

## 🎓 Learning Resources

### For Beginners
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Rust WASM Book](https://rustwasm.github.io/docs/book/)

### For Contributors
- Project Architecture: `ARCHITECTURE.md`
- API Reference: `API_REFERENCE.md`
- Setup Guide: `SETUP_GUIDE.md`

## 📅 Release Process

### Version Numbers
We use Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Cycle
- Patch releases: As needed
- Minor releases: Monthly
- Major releases: Quarterly

## 🙏 Thank You!

Your contributions make Wi-Chain Portal better for everyone. We appreciate your time and effort!

---

**Questions?** Join our [Discord](https://discord.gg/weilchain) or open a [Discussion](https://github.com/weilchain/portal/discussions).

**Happy Contributing! 🚀**
