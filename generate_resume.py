from fpdf import FPDF

class Resume(FPDF):
    def header(self):
        pass

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 8, "Caio Marcos do Amaral Rangel", align="C")

pdf = Resume(format="A4")
pdf.set_auto_page_break(auto=True, margin=18)
pdf.add_page()
pdf.set_left_margin(18)
pdf.set_right_margin(18)

pdf.set_fill_color(255, 45, 45)
pdf.rect(0, 0, 210, 8, "F")

pdf.set_y(16)
pdf.set_font("Helvetica", "B", 20)
pdf.set_text_color(20, 20, 20)
pdf.cell(0, 10, "Caio Marcos do Amaral Rangel", ln=True)

pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(90, 90, 90)
pdf.cell(0, 7, "Desenvolvedor Back-end & Automacao", ln=True)

pdf.set_draw_color(255, 45, 45)
pdf.set_line_width(0.6)
pdf.line(18, pdf.get_y() + 3, 192, pdf.get_y() + 3)
pdf.ln(8)

pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(40, 40, 40)
pdf.cell(0, 6, "(21) 98320-6771  |  caiomarangel@gmail.com", ln=True)
pdf.set_text_color(30, 80, 160)
pdf.cell(0, 6, "linkedin.com/in/caio-marcos-0421a1234", ln=True, link="https://www.linkedin.com/in/caio-marcos-0421a1234/")
pdf.cell(0, 6, "github.com/CaioArc", ln=True, link="https://github.com/CaioArc")
pdf.ln(6)

def section(title):
    pdf.set_text_color(255, 45, 45)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, title.upper(), ln=True)
    pdf.set_draw_color(220, 220, 220)
    pdf.set_line_width(0.3)
    pdf.line(18, pdf.get_y(), 192, pdf.get_y())
    pdf.ln(4)
    pdf.set_text_color(30, 30, 30)

section("Resumo")
pdf.set_font("Helvetica", "", 10)
pdf.multi_cell(0, 5.5, "Profissional com experiencia em desenvolvimento back-end, automacao de processos e integracao de sistemas. Trabalho com Python, Django e APIs REST, aplicando inteligencia artificial para otimizar fluxos e escalar solucoes digitais, com perfil analitico e foco em resultados.")
pdf.ln(4)

section("Formacao Academica")
pdf.set_font("Helvetica", "B", 11)
pdf.cell(0, 6, "Ciencia da Computacao  |  Uninassau", ln=True)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(90, 90, 90)
pdf.cell(0, 5, "Fev 2021  -  Dez 2026", ln=True)
pdf.set_text_color(30, 30, 30)
pdf.ln(4)

section("Habilidades Tecnicas")
pdf.set_font("Helvetica", "", 10)
skills = [
    "Python, Django, Java, JavaScript",
    "APIs REST, SQL, PostgreSQL, Supabase",
    "HTML, CSS, Tailwind, Git",
    "Selenium, Pandas, LangChain",
    "Automacao, n8n, Docker"
]
for s in skills:
    pdf.cell(0, 5.5, "-  " + s, ln=True)
pdf.ln(3)

section("Cursos e Certificacoes")
pdf.set_font("Helvetica", "", 10)
courses = [
    "JavaScript Completo ES6 - Udemy",
    "React com JavaScript - Udemy",
    "Java Orientado a Objetos - Udemy",
    "Banco de Dados - Uninassau",
    "Python Completo - Udemy",
]
for c in courses:
    pdf.cell(0, 5.5, "-  " + c, ln=True)
pdf.ln(3)

section("Projetos")
pdf.set_font("Helvetica", "B", 10)
pdf.set_text_color(30, 30, 30)
pdf.cell(0, 6, "Fluxo Invest", ln=True)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(30, 80, 160)
pdf.cell(0, 5, "https://fluxoinvest.netlify.app/", ln=True, link="https://fluxoinvest.netlify.app/")
pdf.set_text_color(30, 30, 30)
pdf.ln(2)

pdf.set_font("Helvetica", "B", 10)
pdf.cell(0, 6, "Pequeno Aprendiz", ln=True)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(30, 80, 160)
pdf.cell(0, 5, "https://portalaprendiz.netlify.app/", ln=True, link="https://portalaprendiz.netlify.app/")
pdf.set_text_color(30, 30, 30)
pdf.ln(2)

pdf.set_font("Helvetica", "B", 10)
pdf.cell(0, 6, "Atendimento Automatizado com IA para Clinicas", ln=True)
pdf.set_font("Helvetica", "", 10)
pdf.cell(0, 5, "Automacao de atendimento com inteligencia artificial.", ln=True)

pdf.set_fill_color(255, 45, 45)
pdf.rect(0, 289, 210, 8, "F")

out = "/workspace/curriculo-caio-rangel.pdf"
pdf.output(out)
print("ok", out)
