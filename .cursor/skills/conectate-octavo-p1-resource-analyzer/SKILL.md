---
name: conectate-octavo-p1-resource-analyzer
description: Analyze teaching resources for ConectaTE Octavo Periodo 1 sessions and produce a structured learning sequence. Use when the user provides videos, guides, PDFs, or links and asks to adjust objectives, activities, evidence, and assessment for a specific session.
---

# ConectaTE Octavo P1 Resource Analyzer

## Scope

This skill is for `grado octavo`, `periodo 1`, session-level planning.

## Inputs

- Video class links or transcript
- Guide PDF or worksheet
- Optional constraints: session duration, competencies, rubric type

## Output Format (mandatory)

1. **Sesion identificada**: grado, periodo, sesion
2. **Objetivo de aprendizaje**
3. **Saberes previos**
4. **Secuencia didactica**
   - Inicio
   - Desarrollo
   - Cierre
5. **Actividad central**
6. **Evidencia de aprendizaje**
7. **Evaluacion**
   - Criterios
   - Instrumento
8. **Adaptaciones** (ritmos y apoyos)
9. **Compromiso/extension en casa**
10. **Recursos usados** (citar enlaces)

## Workflow

1. Extract key concepts from provided resources.
2. Detect central concept, ethical dimension, and practical action.
3. Build one coherent 50-minute lesson flow.
4. Ensure language is student-friendly and action-oriented.
5. Map each activity to one observable evidence item.
6. If a resource is inaccessible, proceed with available inputs and mark assumptions.

## Pedagogical guardrails

- Prioritize critical digital citizenship and responsible technology use.
- Keep tasks feasible for school context with limited devices.
- Include at least one reflective prompt and one concrete action task.
