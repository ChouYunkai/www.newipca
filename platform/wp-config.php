<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'www_newipc_zjut_' );

/** Database username */
define( 'DB_USER', 'www_newipc_zjut_' );

/** Database password */
define( 'DB_PASSWORD', '1234' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '^2UP=]y0r]RPH/N_%33vIR->=JKr?d9YS,:Ary&l8rUi&U.`gzPe]~0V{dwNTh>/' );
define( 'SECURE_AUTH_KEY',  '`spz|!Iy={]u>Vy]Y_B+dB:3(1Bdhu#hie`oy,unFVjoss=}Dy2wf6X908Yq@t]4' );
define( 'LOGGED_IN_KEY',    'i}WUGYC2A#jU=sQ4l{e0QN9|~m^}?],fo78kuj)(2i&o,x:Cc,TvNPY42.}YJlSd' );
define( 'NONCE_KEY',        'FI/i)yTGfe2zYd/9RPgXgK8<t(Lw=3z$$j<6pFeZ;z3$C;d}$)oO2M)]=b1QgKsR' );
define( 'AUTH_SALT',        'W})F5v?Hi1:>I3:!desmI`2Tn{M!#54`wCl,BQ:u.,9@ Q+Rz-QO)EXo` 9AYN%F' );
define( 'SECURE_AUTH_SALT', '@HX u[rO*o/#2<gI7-M&3.U):qoL~,%fYJ(/E$#^.w]10gok?%w.@wKeBd$}g3:G' );
define( 'LOGGED_IN_SALT',   ']Z`/]y|pR#3x_El0kf0M2bV{6ytUvs*@fhPmgeD$4d5g|P+IV=Z$3x9HPHLF(-I+' );
define( 'NONCE_SALT',       'iJ/f_}PWivobBd@S;&j4fZvv1zkT/2DKb,}XtcR,gU`M7mMN`N6oc9<Go,/lY~O{' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
