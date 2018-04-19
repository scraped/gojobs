<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <div class="columns">
          <div class="column is-one-quarter">
            <aside class="menu box">
              <p class="menu-label">
                Content
              </p>
              <ul class="menu-list">
                <li>
                  <router-link to="/admin" exact>Jobs</router-link>
                  <ul>
                    <li><router-link to="/admin/fetch">Fetch</router-link></li>
                    <li><router-link to="/admin/process">Process</router-link></li>
                    <li><router-link to="/admin/raw">Raw</router-link></li>
                    <li><router-link to="/admin/processed">Processed</router-link></li>
                  </ul>
                </li>
                <li><a>Crews</a></li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
