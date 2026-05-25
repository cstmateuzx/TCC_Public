<script>
  /** @type {1 | 2 | 3} */
  export let current = 1;
</script>

<nav class="steps-bxd" aria-label="Etapas do agendamento">
  <span class="step-bxd" class:step-bxd--active={current === 1} class:step-bxd--done={current > 1}>
    1. Horário
  </span>
  <span class="step-bxd" class:step-bxd--active={current === 2} class:step-bxd--done={current > 2}>
    2. Serviço
  </span>
  <span class="step-bxd" class:step-bxd--active={current === 3}>
    3. Confirmação
  </span>
</nav>
