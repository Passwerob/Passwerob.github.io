import os
import re
import shutil
import sys

# LeetCode题目信息（题号、标题、难度、标签）
PROBLEM_INFO = {
    "001": {"title": "Two Sum", "difficulty": "Easy", "tags": ["Array", "Hash Table"]},
    "002": {"title": "Add Two Numbers", "difficulty": "Medium", "tags": ["Linked List", "Math"]},
    "003": {"title": "Longest Substring Without Repeating Characters", "difficulty": "Medium", "tags": ["String", "Sliding Window"]},
    "004": {"title": "Median of Two Sorted Arrays", "difficulty": "Hard", "tags": ["Array", "Binary Search", "Divide and Conquer"]},
    "005": {"title": "Longest Palindromic Substring", "difficulty": "Medium", "tags": ["String", "Dynamic Programming"]},
    "006": {"title": "Zigzag Conversion", "difficulty": "Medium", "tags": ["String"]},
    "007": {"title": "Reverse Integer", "difficulty": "Easy", "tags": ["Math"]},
    "008": {"title": "String to Integer (atoi)", "difficulty": "Medium", "tags": ["String", "Math"]},
    "009": {"title": "Palindrome Number", "difficulty": "Easy", "tags": ["Math"]},
    "090": {"title": "Subsets II", "difficulty": "Medium", "tags": ["Array", "Backtracking"]},
    "1464": {"title": "Maximum Product of Two Elements in an Array", "difficulty": "Easy", "tags": ["Array", "Sorting"]},
    "2057": {"title": "Smallest Index With Equal Value", "difficulty": "Easy", "tags": ["Array"]}
}

# 问题描述和示例（可以根据需要添加）
PROBLEM_DESCRIPTIONS = {
    "1464": {
        "description": "Given the array of integers <code>nums</code>, you will choose two different indices <code>i</code> and <code>j</code> of that array. <em>Return the maximum value of</em> <code>(nums[i]-1)*(nums[j]-1)</code>.",
        "examples": [
            {
                "input": "nums = [3,4,5,2]",
                "output": "12",
                "explanation": "If you choose the indices i=1 and j=2 (indexed from 0), you will get the maximum value, that is, (nums[1]-1)*(nums[2]-1) = (4-1)*(5-1) = 3*4 = 12."
            },
            {
                "input": "nums = [1,5,4,5]",
                "output": "16",
                "explanation": "Choosing the indices i=1 and j=3 (indexed from 0), you will get the maximum value of (5-1)*(5-1) = 16."
            },
            {
                "input": "nums = [3,7]",
                "output": "12",
                "explanation": ""
            }
        ],
        "constraints": [
            "2 <= nums.length <= 500",
            "1 <= nums[i] <= 10^3"
        ]
    }
}

# HTML模板
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{problem_number}. {problem_title} | Python Solution</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/python.min.js"></script>
    <style>
        .problem-container {{
            background-color: var(--background-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 30px;
            margin-bottom: 40px;
        }}
        
        .problem-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }}
        
        .problem-title {{
            font-size: 1.8rem;
            color: var(--primary-color);
            margin: 0;
        }}
        
        .problem-difficulty {{
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: 500;
            font-size: 0.9rem;
            background-color: #5cb85c;
            color: white;
        }}
        
        .problem-difficulty.medium {{
            background-color: #f0ad4e;
        }}
        
        .problem-difficulty.hard {{
            background-color: #d9534f;
        }}
        
        .problem-description {{
            line-height: 1.6;
            margin-bottom: 30px;
        }}
        
        .problem-examples {{
            margin-bottom: 30px;
        }}
        
        .example {{
            background-color: var(--light-background);
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }}
        
        .example-title {{
            font-weight: 600;
            margin-bottom: 10px;
        }}
        
        .example-content {{
            font-family: monospace;
            white-space: pre;
        }}
        
        .problem-constraints {{
            margin-bottom: 30px;
        }}
        
        .constraint {{
            margin-bottom: 5px;
        }}
        
        .solution-container {{
            background-color: var(--background-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 30px;
            margin-bottom: 40px;
        }}
        
        .solution-title {{
            font-size: 1.5rem;
            color: var(--primary-color);
            margin-bottom: 20px;
        }}
        
        .solution-approach {{
            margin-bottom: 20px;
        }}
        
        .code-block {{
            background-color: #282c34;
            border-radius: 4px;
            margin-bottom: 20px;
            position: relative;
        }}
        
        .code-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background-color: #21252b;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            color: #abb2bf;
            font-family: monospace;
        }}
        
        .code-language {{
            font-weight: 600;
        }}
        
        .copy-button {{
            background: none;
            border: none;
            color: #abb2bf;
            cursor: pointer;
            transition: color 0.2s;
        }}
        
        .copy-button:hover {{
            color: white;
        }}
        
        .code-content {{
            padding: 15px;
            overflow-x: auto;
        }}
        
        .complexity-analysis {{
            margin-bottom: 20px;
        }}
        
        .complexity-item {{
            margin-bottom: 10px;
        }}
        
        .complexity-type {{
            font-weight: 600;
            color: var(--primary-color);
        }}
        
        .notes {{
            background-color: #f8f9fa;
            border-left: 4px solid var(--accent-color);
            padding: 15px;
            margin-bottom: 20px;
        }}
        
        .related-problems {{
            background-color: var(--background-color);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 30px;
        }}
        
        .related-problems-title {{
            font-size: 1.5rem;
            color: var(--primary-color);
            margin-bottom: 20px;
        }}
        
        .related-problems-list {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }}
        
        .related-problem {{
            background-color: var(--light-background);
            padding: 15px;
            border-radius: 4px;
            transition: var(--transition);
        }}
        
        .related-problem:hover {{
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }}
        
        .related-problem-title {{
            font-weight: 600;
            margin-bottom: 5px;
        }}
        
        .related-problem-difficulty {{
            font-size: 0.8rem;
            color: #6c757d;
        }}
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1 class="logo">My Portfolio</h1>
            <nav>
                <ul>
                    <li><a href="../../index.html">Home</a></li>
                    <li><a href="../index.html" class="active">LeetCode Notes</a></li>
                    <li><a href="../../deep-learning/index.html">Deep Learning</a></li>
                    <li><a href="../../github/index.html">GitHub Projects</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h2>LeetCode Solution</h2>
                <p>Problem {problem_number}: {problem_title}</p>
            </div>
        </div>
    </section>

    <section class="problem">
        <div class="container">
            <div class="problem-container">
                <div class="problem-header">
                    <h2 class="problem-title">{problem_number}. {problem_title}</h2>
                    <span class="problem-difficulty {difficulty_class}">{problem_difficulty}</span>
                </div>
                
                <div class="problem-description">
                    <p>{problem_description}</p>
                </div>
                
                <div class="problem-examples">
                    <h3>Examples:</h3>
                    
                    {examples_html}
                </div>
                
                <div class="problem-constraints">
                    <h3>Constraints:</h3>
                    <ul>
                        {constraints_html}
                    </ul>
                </div>
            </div>
            
            <div class="solution-container">
                <h2 class="solution-title">Solution</h2>
                
                <div class="solution-approach">
                    <h3>My Python Solution</h3>
                    
                    <div class="code-block">
                        <div class="code-header">
                            <span class="code-language">Python</span>
                            <button class="copy-button" onclick="copyCode(this)">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <div class="code-content">
                            <pre><code class="language-python">{solution_code}</code></pre>
                        </div>
                    </div>
                    
                    <div class="complexity-analysis">
                        <h4>Complexity Analysis:</h4>
                        <div class="complexity-item">
                            <span class="complexity-type">Time Complexity:</span> {time_complexity}
                        </div>
                        <div class="complexity-item">
                            <span class="complexity-type">Space Complexity:</span> {space_complexity}
                        </div>
                    </div>
                </div>
                
                <div class="notes">
                    <h4>Notes:</h4>
                    <p>{solution_notes}</p>
                </div>
            </div>
            
            <div class="related-problems">
                <h2 class="related-problems-title">Related Problems</h2>
                
                <div class="related-problems-list">
                    {related_problems_html}
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Navigation</h3>
                    <ul>
                        <li><a href="../../index.html">Home</a></li>
                        <li><a href="../index.html">LeetCode Notes</a></li>
                        <li><a href="../../deep-learning/index.html">Deep Learning</a></li>
                        <li><a href="../../github/index.html">GitHub Projects</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Connect</h3>
                    <div class="social-links">
                        <a href="https://github.com/Passwerob" target="_blank"><i class="fab fa-github"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2025 My Personal Website. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../../js/main.js"></script>
    <script>
        // 代码高亮
        document.addEventListener('DOMContentLoaded', (event) => {{
            document.querySelectorAll('pre code').forEach((block) => {{
                hljs.highlightBlock(block);
            }});
        }});
        
        // 复制代码功能
        function copyCode(button) {{
            const codeBlock = button.parentElement.nextElementSibling;
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(() => {{
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {{
                    button.innerHTML = originalText;
                }}, 2000);
            }}).catch(err => {{
                console.error('Failed to copy: ', err);
            }});
        }}
    </script>
</body>
</html>
"""

def get_problem_info(problem_number):
    """获取题目信息"""
    if problem_number in PROBLEM_INFO:
        return PROBLEM_INFO[problem_number]
    else:
        # 如果没有预定义信息，返回默认值
        return {
            "title": f"Problem {problem_number}",
            "difficulty": "Medium",
            "tags": ["Array"]
        }

def get_problem_description(problem_number):
    """获取题目描述"""
    if problem_number in PROBLEM_DESCRIPTIONS:
        return PROBLEM_DESCRIPTIONS[problem_number]
    else:
        # 如果没有预定义描述，返回默认值
        return {
            "description": "No description available.",
            "examples": [],
            "constraints": []
        }

def generate_examples_html(examples):
    """生成示例HTML"""
    if not examples:
        return "<div class='example'><div class='example-title'>No examples available.</div></div>"
    
    html = ""
    for i, example in enumerate(examples):
        html += f"""
        <div class="example">
            <div class="example-title">Example {i+1}:</div>
            <div class="example-content">
<strong>Input:</strong> {example['input']}
<strong>Output:</strong> {example['output']}
"""
        if example['explanation']:
            html += f"<strong>Explanation:</strong> {example['explanation']}\n"
        
        html += "            </div>\n        </div>\n"
    
    return html

def generate_constraints_html(constraints):
    """生成约束条件HTML"""
    if not constraints:
        return "<li class='constraint'>No constraints available.</li>"
    
    html = ""
    for constraint in constraints:
        html += f"<li class='constraint'><code>{constraint}</code></li>\n"
    
    return html

def generate_related_problems_html(problem_number):
    """生成相关问题HTML"""
    # 这里可以根据题目标签或其他逻辑来生成相关问题
    # 这里只是一个简单的示例
    related_problems = []
    
    # 根据标签找到相关问题
    current_tags = PROBLEM_INFO.get(problem_number, {}).get("tags", [])
    
    for num, info in PROBLEM_INFO.items():
        if num != problem_number and any(tag in current_tags for tag in info.get("tags", [])):
            related_problems.append({
                "number": num,
                "title": info["title"],
                "difficulty": info["difficulty"]
            })
            if len(related_problems) >= 3:  # 最多显示3个相关问题
                break
    
    if not related_problems:
        return "<p>No related problems available.</p>"
    
    html = ""
    for problem in related_problems:
        html += f"""
        <a href="{problem['number']}-{problem['title'].lower().replace(' ', '-')}.html" class="related-problem">
            <div class="related-problem-title">{problem['number']}. {problem['title']}</div>
            <div class="related-problem-difficulty">{problem['difficulty']}</div>
        </a>
        """
    
    return html

def convert_solution(source_file, output_dir):
    """将Python题解转换为HTML页面"""
    # 从文件名中提取题号
    filename = os.path.basename(source_file)
    problem_number = filename.split('.')[0]
    
    # 读取Python代码
    with open(source_file, 'r', encoding='utf-8') as f:
        solution_code = f.read()
    
    # 获取题目信息
    problem_info = get_problem_info(problem_number)
    problem_title = problem_info["title"]
    problem_difficulty = problem_info["difficulty"]
    difficulty_class = problem_difficulty.lower()
    
    # 获取题目描述
    problem_desc = get_problem_description(problem_number)
    problem_description = problem_desc["description"]
    examples = problem_desc["examples"]
    constraints = problem_desc["constraints"]
    
    # 生成HTML内容
    examples_html = generate_examples_html(examples)
    constraints_html = generate_constraints_html(constraints)
    related_problems_html = generate_related_problems_html(problem_number)
    
    # 默认的复杂度分析和注释
    time_complexity = "O(n) where n is the input size."
    space_complexity = "O(n) in the worst case."
    solution_notes = "This solution handles the problem efficiently. Consider edge cases when implementing."
    
    # 生成HTML文件
    html_content = HTML_TEMPLATE.format(
        problem_number=problem_number,
        problem_title=problem_title,
        problem_difficulty=problem_difficulty,
        difficulty_class=difficulty_class,
        problem_description=problem_description,
        examples_html=examples_html,
        constraints_html=constraints_html,
        solution_code=solution_code,
        time_complexity=time_complexity,
        space_complexity=space_complexity,
        solution_notes=solution_notes,
        related_problems_html=related_problems_html
    )
    
    # 创建输出文件名
    output_filename = f"{problem_number}-{problem_title.lower().replace(' ', '-')}.html"
    output_path = os.path.join(output_dir, output_filename)
    
    # 写入HTML文件
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Converted {source_file} to {output_path}")
    return output_path

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("Usage: python convert_solutions.py <source_directory>")
        return
    
    source_dir = sys.argv[1]
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 处理所有Python文件
    for filename in os.listdir(source_dir):
        if filename.endswith('.py') and not filename == os.path.basename(__file__):
            source_file = os.path.join(source_dir, filename)
            convert_solution(source_file, output_dir)
    
    print(f"All solutions have been converted to HTML in {output_dir}")

if __name__ == "__main__":
    main() 