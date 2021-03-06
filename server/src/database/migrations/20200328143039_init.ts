import * as Knex from 'knex';

// creates the tables
export async function up(knex: Knex): Promise<any> {
  return (
    knex.schema
      // users table
      .createTable('users', table => {
        table.increments();
        table
          .string('name')
          .notNullable()
          .unique();
        // stored as hash
        table.string('password').notNullable();
        table.timestamps(true, true);
      })
      // workspaces table
      .createTable('workspaces', table => {
        table.increments();
        table.string('name').notNullable();
        table
          .boolean('public')
          .notNullable()
          .defaultTo(false);
        // workspace owner
        table
          .integer('user_id')
          .unsigned()
          .notNullable();
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      })
      // join table for additional workspace users
      .createTable('workspaces_users', table => {
        table.increments();
        // workspace
        table
          .integer('workspace_id')
          .unsigned()
          .notNullable();
        table
          .foreign('workspace_id')
          .references('id')
          .inTable('workspaces')
          .onDelete('CASCADE');
        // user
        table
          .integer('user_id')
          .unsigned()
          .notNullable();
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      })
      // metadata table
      .createTable('metadata', table => {
        table.increments();
        // maximum length of url in browsers
        table.string('url', 2048).notNullable().unique();
        table.string('title');
        table.string('description', 2048);
        table.string('image', 2048); // image url
      })
      // items table
      .createTable('items', table => {
        table.increments();
        table.string('name').notNullable();
        table.text('body');
        // item workspace
        table
          .integer('workspace_id')
          .unsigned()
          .notNullable();
        table
          .foreign('workspace_id')
          .references('id')
          .inTable('workspaces')
          .onDelete('CASCADE');
        // item url metadata
        table
          .integer('metadata_id')
          .unsigned();
        table
          .foreign('metadata_id')
          .references('id')
          .inTable('metadata')
          .onDelete('SET NULL');
        table.timestamps(true, true);
      })
      // connections table
      .createTable('connections', table => {
        table.increments();
        table.string('name');
        // the connection items
        table
          .integer('item1_id')
          .unsigned()
          .notNullable();
        table
          .foreign('item1_id')
          .references('id')
          .inTable('items')
          .onDelete('CASCADE');
        table
          .integer('item2_id')
          .unsigned()
          .notNullable();
        table
          .foreign('item2_id')
          .references('id')
          .inTable('items')
          .onDelete('CASCADE');
        // connection url metadata
        table
          .integer('metadata_id')
          .unsigned();
        table
          .foreign('metadata_id')
          .references('id')
          .inTable('metadata')
          .onDelete('SET NULL');
        table.timestamps(true, true);
      })
      // tags table
      .createTable('tags', table => {
        table.increments();
        table.string('name').notNullable();
        // tag workspace
        table
          .integer('workspace_id')
          .unsigned()
          .notNullable();
        table
          .foreign('workspace_id')
          .references('id')
          .inTable('workspaces')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      })
      // connections and tags join table
      .createTable('connections_tags', table => {
        table.increments();
        // connection
        table
          .integer('connection_id')
          .unsigned()
          .notNullable();
        table
          .foreign('connection_id')
          .references('id')
          .inTable('connections')
          .onDelete('CASCADE');
        // tag
        table
          .integer('tag_id')
          .unsigned()
          .notNullable();
        table
          .foreign('tag_id')
          .references('id')
          .inTable('tags')
          .onDelete('CASCADE');
      })
  );
}

// deletes the tables
export async function down(knex: Knex) {
  return knex.schema
    .dropTableIfExists('connections_tags')
    .dropTableIfExists('tags')
    .dropTableIfExists('connections')
    .dropTableIfExists('items')
    .dropTableIfExists('metadata')
    .dropTableIfExists('workspaces_users')
    .dropTableIfExists('workspaces')
    .dropTableIfExists('users');
}
