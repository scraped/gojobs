<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Admin panel</h1>

        <b-tabs>
          <b-tab-item label="Jobs">
            <h2 class="subtitle">Jobs</h2>
          </b-tab-item>
          <b-tab-item label="Crews"></b-tab-item>
          <b-tab-item label="Users"></b-tab-item>
        </b-tabs>

        <a
          class="button is-primary is-outlined"
          href="/api/jobs/upload"
          target="_blank">Upload all raw jobs</a>
      </div>
    </section>
  </div>
</template>
